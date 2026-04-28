const { createFirestoreModel, applyPopulateProjection } = require('../lib/firestoreModel');

const Chat = createFirestoreModel({
  collectionName: 'chats',
  relationPopulators: {
    participants: async (participantIds, projection) => {
      const User = require('./User');
      const ids = Array.isArray(participantIds) ? participantIds : [];
      const users = await Promise.all(ids.map((id) => User.findById(id)));
      return users.filter(Boolean).map((user) => applyPopulateProjection(user.toObject(), projection));
    },
    listing: async (listingId, projection) => {
      const Listing = require('./Listing');
      const listing = await Listing.findById(listingId);
      if (!listing) return null;
      return applyPopulateProjection(listing.toObject(), projection);
    }
  }
});

module.exports = Chat;
