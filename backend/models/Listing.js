const { createFirestoreModel, applyPopulateProjection } = require('../lib/firestoreModel');

const Listing = createFirestoreModel({
  collectionName: 'listings',
  relationPopulators: {
    seller: async (sellerId, projection) => {
      const normalizedSellerId = sellerId && typeof sellerId === 'object'
        ? (sellerId._id || sellerId.id || null)
        : sellerId;

      if (!normalizedSellerId) return null;
      const User = require('./User');
      const seller = await User.findById(normalizedSellerId);
      if (!seller) return null;
      return applyPopulateProjection(seller.toObject(), projection);
    }
  }
});

module.exports = Listing;
