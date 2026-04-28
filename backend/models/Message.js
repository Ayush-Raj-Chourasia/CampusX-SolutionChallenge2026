const { createFirestoreModel, applyPopulateProjection } = require('../lib/firestoreModel');

const Message = createFirestoreModel({
  collectionName: 'messages',
  relationPopulators: {
    sender: async (senderId, projection) => {
      const User = require('./User');
      const sender = await User.findById(senderId);
      if (!sender) return null;
      return applyPopulateProjection(sender.toObject(), projection);
    }
  }
});

module.exports = Message;
