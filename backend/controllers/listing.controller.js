const Listing = require('../models/Listing');
const User = require('../models/User');

// @desc    Get all listings (filtered by user's college)
// @route   GET /api/listings
// @access  Private
const getListings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Extract college domain from user's email
    const userCollege = user.college;
    
    // Build query
    const query = {
      status: 'active'
    };

    // Filter by category if provided
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Get listings from same college only
    const listings = await Listing.find(query)
      .populate('seller', 'name email college verified trustScore')
      .sort({ createdAt: -1 })
      .limit(100);

    // Filter to only show listings from same college
    const collegeListings = listings.filter(listing => 
      listing.seller.college === userCollege
    );

    // Format response
    const formattedListings = collegeListings.map(listing => ({
      id: listing._id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      originalPrice: listing.originalPrice,
      condition: listing.condition,
      category: listing.category,
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '📦',
      images: listing.images || [],
      seller: listing.seller.name,
      sellerId: listing.seller._id,
      college: listing.seller.college,
      verified: listing.seller.verified,
      trustScore: listing.seller.trustScore,
      escrow: true,
      wishlist: listing.wishlists.includes(req.user.id),
      status: listing.status,
      views: listing.views || 0,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: formattedListings.length,
      data: formattedListings
    });

  } catch (error) {
    console.error('Get Listings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Private
const getListingById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name email college verified trustScore');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing is from same college
    if (listing.seller.college !== user.college) {
      return res.status(403).json({
        success: false,
        message: 'You can only view listings from your college'
      });
    }

    // Increment views
    listing.views = (listing.views || 0) + 1;
    await listing.save();

    const formattedListing = {
      id: listing._id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      originalPrice: listing.originalPrice,
      condition: listing.condition,
      category: listing.category,
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '📦',
      images: listing.images || [],
      seller: listing.seller.name,
      sellerId: listing.seller._id,
      college: listing.seller.college,
      verified: listing.seller.verified,
      trustScore: listing.seller.trustScore,
      escrow: true,
      wishlist: listing.wishlists.includes(req.user.id),
      status: listing.status,
      views: listing.views,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      location: listing.location,
      tags: listing.tags
    };

    res.status(200).json({
      success: true,
      data: formattedListing
    });

  } catch (error) {
    console.error('Get Listing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listing',
      error: error.message
    });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      condition,
      category,
      images,
      location,
      tags
    } = req.body;

    // Validation
    if (!title || !description || !price || !originalPrice || !condition || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate price
    if (parseFloat(price) <= 0 || parseFloat(originalPrice) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Prices must be greater than 0'
      });
    }

    if (parseFloat(price) > parseFloat(originalPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Selling price cannot be greater than original price'
      });
    }

    // Create listing
    const listing = await Listing.create({
      seller: req.user.id,
      title,
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      condition,
      category,
      images: images || [],
      location: location || {},
      tags: tags || [],
      status: 'active'
    });

    // Populate seller info
    await listing.populate('seller', 'name email college verified trustScore');

    const formattedListing = {
      id: listing._id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      originalPrice: listing.originalPrice,
      condition: listing.condition,
      category: listing.category,
      image: listing.images && listing.images.length > 0 ? listing.images[0] : '📦',
      images: listing.images,
      seller: listing.seller.name,
      sellerId: listing.seller._id,
      college: listing.seller.college,
      verified: listing.seller.verified,
      trustScore: listing.seller.trustScore,
      escrow: true,
      wishlist: false,
      status: listing.status,
      views: 0,
      createdAt: listing.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: formattedListing
    });

  } catch (error) {
    console.error('Create Listing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating listing',
      error: error.message
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (owner only)
const updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is the owner
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // Update fields
    const updateFields = [
      'title', 'description', 'price', 'originalPrice', 
      'condition', 'category', 'images', 'location', 'tags', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();
    await listing.populate('seller', 'name email college verified trustScore');

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: listing
    });

  } catch (error) {
    console.error('Update Listing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating listing',
      error: error.message
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (owner only)
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is the owner
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    // Soft delete - mark as removed instead of deleting
    listing.status = 'removed';
    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete Listing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting listing',
      error: error.message
    });
  }
};

// @desc    Toggle wishlist
// @route   POST /api/listings/:id/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const userId = req.user.id;
    const wishlistIndex = listing.wishlists.indexOf(userId);

    if (wishlistIndex > -1) {
      // Remove from wishlist
      listing.wishlists.splice(wishlistIndex, 1);
    } else {
      // Add to wishlist
      listing.wishlists.push(userId);
    }

    await listing.save();

    res.status(200).json({
      success: true,
      message: wishlistIndex > -1 ? 'Removed from wishlist' : 'Added to wishlist',
      data: {
        wishlisted: wishlistIndex === -1
      }
    });

  } catch (error) {
    console.error('Toggle Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist',
      error: error.message
    });
  }
};

// @desc    Search listings
// @route   GET /api/listings/search
// @access  Private
const searchListings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
      });
    }

    // Text search
    const listings = await Listing.find({
      $text: { $search: q },
      status: 'active'
    })
      .populate('seller', 'name email college verified trustScore')
      .sort({ score: { $meta: 'textScore' } })
      .limit(50);

    // Filter by same college
    const collegeListings = listings.filter(listing => 
      listing.seller.college === user.college
    );

    res.status(200).json({
      success: true,
      count: collegeListings.length,
      data: collegeListings
    });

  } catch (error) {
    console.error('Search Listings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching listings',
      error: error.message
    });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  toggleWishlist,
  searchListings
};
