const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes (with college filter)
router.get('/', protect, listingController.getListings);
router.get('/:id', protect, listingController.getListingById);

// Protected routes (require authentication)
router.post('/', protect, listingController.createListing);
router.put('/:id', protect, listingController.updateListing);
router.delete('/:id', protect, listingController.deleteListing);

// Wishlist
router.post('/:id/wishlist', protect, listingController.toggleWishlist);

// Search
router.get('/search', protect, listingController.searchListings);

module.exports = router;
