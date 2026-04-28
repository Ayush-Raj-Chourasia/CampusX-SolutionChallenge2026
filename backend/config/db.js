const { connectFirestore } = require('./firestore');

const connectDB = async () => {
  try {
    await connectFirestore();
  } catch (error) {
    console.error(`❌ Firestore Connection Error: ${error.message}`);
    console.error(`⚠️  Server will start but database operations may fail`);
  }
};

module.exports = connectDB;
