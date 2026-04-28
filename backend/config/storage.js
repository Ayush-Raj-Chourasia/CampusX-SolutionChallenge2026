const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = bucketName ? storage.bucket(bucketName) : null;

function isDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:');
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL');
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
}

function getExtension(mimeType) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  return 'jpg';
}

async function uploadImage(image) {
  if (!image) {
    return null;
  }

  if (isHttpUrl(image)) {
    return image;
  }

  if (!bucket) {
    throw new Error('GCS bucket is not configured');
  }

  const { mimeType, buffer } = isDataUrl(image)
    ? parseDataUrl(image)
    : { mimeType: 'image/jpeg', buffer: Buffer.from(image) };

  const extension = getExtension(mimeType);
  const objectName = `campusx/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const file = bucket.file(objectName);

  await file.save(buffer, {
    contentType: mimeType,
    resumable: false,
    validation: false
  });

  try {
    await file.makePublic();
  } catch (error) {
    // If the bucket uses uniform access, makePublic may fail. The object can still
    // be served if the bucket is made public or via a signed URL later.
    console.warn('Could not make GCS object public:', error.message);
  }

  return `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(objectName)}`;
}

async function deleteImage(imageUrl) {
  if (!bucket || !imageUrl || !isHttpUrl(imageUrl)) {
    return;
  }

  try {
    const prefix = `https://storage.googleapis.com/${bucketName}/`;
    const objectName = imageUrl.startsWith(prefix)
      ? decodeURIComponent(imageUrl.slice(prefix.length))
      : null;

    if (!objectName) {
      return;
    }

    await bucket.file(objectName).delete({ ignoreNotFound: true });
  } catch (error) {
    console.warn('GCS delete warning:', error.message);
  }
}

async function normalizeImages(images = []) {
  const resolved = await Promise.all((images || []).map((image) => uploadImage(image)));
  return resolved.filter(Boolean);
}

module.exports = { uploadImage, deleteImage, normalizeImages };
