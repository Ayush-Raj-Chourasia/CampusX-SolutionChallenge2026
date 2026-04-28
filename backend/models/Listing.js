const { createFirestoreModel, applyPopulateProjection } = require('../lib/firestoreModel');

const Listing = createFirestoreModel({
  collectionName: 'listings',
  relationPopulators: {
    seller: async (sellerId, projection) => {
      if (!sellerId) return null;
      const User = require('./User');
      const seller = await User.findById(sellerId);
      if (!seller) return null;
      return applyPopulateProjection(seller.toObject(), projection);
    }
  }
});

module.exports = Listing;
