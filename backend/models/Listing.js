const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 2000
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair'],
    required: true
  },
  category: {
    type: String,
    enum: ['books', 'electronics', 'cycles', 'furniture', 'clothing', 'instruments', 'other'],
    required: true
  },
  images: [{
    type: String // Cloudinary URLs
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'removed', 'pending'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  wishlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  location: {
    hostel: String,
    block: String,
    campus: String
  },
  aiSuggestedPrice: {
    type: Number
  },
  aiPriceConfidence: {
    type: Number
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days
  }
}, {
  timestamps: true
});

// Index for search and filtering
listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ seller: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
