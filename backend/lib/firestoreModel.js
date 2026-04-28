const { db } = require('../config/firestore');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseSelect(spec) {
  if (!spec || typeof spec !== 'string') {
    return { exclude: [] };
  }

  return {
    exclude: spec
      .split(/\s+/)
      .filter(Boolean)
      .filter((field) => field.startsWith('-'))
      .map((field) => field.slice(1))
  };
}

function applyProjection(doc, projection) {
  if (!doc || !projection || !projection.exclude || projection.exclude.length === 0) {
    return doc;
  }

  const next = clone(doc);
  for (const field of projection.exclude) {
    delete next[field];
  }
  return next;
}

function applyPopulateProjection(doc, projection) {
  if (!doc || !projection || typeof projection !== 'string') {
    return doc;
  }

  const fields = projection
    .split(/\s+/)
    .filter(Boolean)
    .filter((field) => !field.startsWith('-'))
    .map((field) => field.replace(/^\+/, ''));

  if (fields.length === 0) {
    return doc;
  }

  const result = { _id: doc._id };
  for (const field of fields) {
    if (doc[field] !== undefined) {
      result[field] = doc[field];
    }
  }
  return result;
}

function matchesText(value, search) {
  if (!search) return true;
  const haystack = `${value.title || ''} ${value.description || ''}`.toLowerCase();
  return search.split(/\s+/).every((term) => haystack.includes(term.toLowerCase()));
}

function matchesQuery(doc, query = {}) {
  return Object.entries(query).every(([key, expected]) => {
    if (key === '$text' && expected && expected.$search) {
      return matchesText(doc, expected.$search);
    }

    const actual = doc[key];

    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if ('$gte' in expected && !(Number(actual) >= Number(expected.$gte))) return false;
      if ('$lte' in expected && !(Number(actual) <= Number(expected.$lte))) return false;
      if ('$all' in expected) {
        const values = Array.isArray(actual) ? actual.map(String) : [];
        return expected.$all.every((item) => values.includes(String(item)));
      }
      return true;
    }

    if (Array.isArray(actual)) {
      return actual.map(String).includes(String(expected));
    }

    return String(actual) === String(expected);
  });
}

class FirestoreDocument {
  constructor(model, data = {}) {
    Object.defineProperty(this, '_model', {
      value: model,
      enumerable: false,
      writable: true
    });
    this._id = data._id || data.id || null;
    Object.assign(this, data);
  }

  async save() {
    await this._model._saveDocument(this);
    return this;
  }

  async populate(path, projection) {
    await this._model._populateDocument(this, path, projection);
    return this;
  }

  toObject() {
    const output = { ...this };
    for (const key of Object.keys(output)) {
      if (key.startsWith('_') && key !== '_id') {
        delete output[key];
      }
    }
    return output;
  }

  toJSON() {
    return this.toObject();
  }
}

class FirestoreQuery {
  constructor(model, executor) {
    this.model = model;
    this.executor = executor;
    this.projection = null;
    this.populates = [];
    this.sortSpec = null;
    this.limitCount = null;
  }

  select(spec) {
    this.projection = parseSelect(spec);
    return this;
  }

  populate(path, projection) {
    this.populates.push({ path, projection });
    return this;
  }

  sort(spec) {
    this.sortSpec = spec;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  async exec() {
    let result = await this.executor();

    if (Array.isArray(result)) {
      if (this.sortSpec) {
        const [[field, direction]] = Object.entries(this.sortSpec);
        result.sort((left, right) => {
          const leftValue = left[field];
          const rightValue = right[field];
          if (leftValue < rightValue) return direction < 0 ? 1 : -1;
          if (leftValue > rightValue) return direction < 0 ? -1 : 1;
          return 0;
        });
      }

      if (this.limitCount !== null) {
        result = result.slice(0, this.limitCount);
      }
    }

    if (this.projection) {
      if (Array.isArray(result)) {
        result = result.map((item) => this.model._fromPlain(applyProjection(item.toObject(), this.projection)));
      } else if (result) {
        result = this.model._fromPlain(applyProjection(result.toObject(), this.projection));
      }
    }

    for (const populateDef of this.populates) {
      if (Array.isArray(result)) {
        for (const item of result) {
          await this.model._populateDocument(item, populateDef.path, populateDef.projection);
        }
      } else if (result) {
        await this.model._populateDocument(result, populateDef.path, populateDef.projection);
      }
    }

    return result;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

function createFirestoreModel({ collectionName, relationPopulators, hooks = {} }) {
  class Model extends FirestoreDocument {
    static collectionName = collectionName;

    constructor(data = {}) {
      super(Model, data);
    }

    static _collection() {
      return db.collection(collectionName);
    }

    static _fromPlain(data) {
      if (!data) return null;
      return new Model(data);
    }

    static _toPlain(document) {
      const output = { ...document };
      delete output._model;
      delete output._id;
      delete output._isNew;
      return output;
    }

    static async _saveDocument(document) {
      if (hooks.beforeSave) {
        await hooks.beforeSave(document);
      }

      const plain = Model._toPlain(document);
      const docId = document._id || this._collection().doc().id;
      document._id = docId;
      await this._collection().doc(docId).set(plain, { merge: true });
    }

    static async _populateDocument(document, path, projection) {
      const handler = relationPopulators[path];
      if (!handler) {
        return document;
      }

      const value = document[path];
      document[path] = await handler(value, projection);
      return document;
    }

    static create(data) {
      const instance = new Model(data);
      instance._isNew = true;
      return instance.save();
    }

    static findById(id) {
      return new FirestoreQuery(Model, async () => {
        const snapshot = await this._collection().doc(String(id)).get();
        if (!snapshot.exists) return null;
        const data = snapshot.data();
        return new Model({ ...data, _id: snapshot.id });
      });
    }

    static findOne(query) {
      return new FirestoreQuery(Model, async () => {
        const snapshot = await this._collection().get();
        const match = snapshot.docs.find((doc) => matchesQuery(doc.data(), query));
        if (!match) return null;
        return new Model({ ...match.data(), _id: match.id });
      });
    }

    static find(query = {}) {
      return new FirestoreQuery(Model, async () => {
        const snapshot = await this._collection().get();
        return snapshot.docs
          .filter((doc) => matchesQuery(doc.data(), query))
          .map((doc) => new Model({ ...doc.data(), _id: doc.id }));
      });
    }

    static async findByIdAndUpdate(id, updates) {
      const existing = await this.findById(id);
      if (!existing) return null;
      Object.assign(existing, updates);
      await existing.save();
      return existing;
    }
  }

  return Model;
}

module.exports = {
  createFirestoreModel,
  FirestoreDocument,
  FirestoreQuery,
  parseSelect,
  applyProjection,
  applyPopulateProjection
};
