const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
  ignoreUndefinedProperties: true
});

async function connectFirestore() {
  try {
    await db.collection('_health').limit(1).get();
    console.log('✅ Firestore connection ready');
  } catch (error) {
    console.warn(`⚠️  Firestore check failed: ${error.message}`);
  }
}

module.exports = { db, connectFirestore };
