# 🎯 Backend Implementation Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB
- **Option A: Local MongoDB**
  ```bash
  # Install MongoDB: https://www.mongodb.com/try/download/community
  # Start MongoDB service
  mongod
  ```

- **Option B: MongoDB Atlas (Cloud - Recommended)**
  1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
  2. Create free cluster
  3. Get connection string
  4. Update `.env` with: `MONGODB_URI=mongodb+srv://...`

### 3. Create .env File
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 4. Start Server
```bash
npm run dev
```

Server will run on: http://localhost:5000

---

## Implementation Checklist

### Phase 1: Authentication (Day 1-3)
- [x] User model created
- [ ] Signup endpoint
- [ ] Login endpoint
- [ ] Email verification with OTP
- [ ] JWT token generation
- [ ] Protected routes middleware

**Files to create:**
- `routes/auth.routes.js`
- `controllers/authController.js`
- `services/email.service.js`

### Phase 2: Listings (Day 4-6)
- [x] Listing model created
- [ ] Create listing endpoint
- [ ] Get all listings (with filters)
- [ ] Get single listing
- [ ] Update listing
- [ ] Delete listing
- [ ] Image upload with Cloudinary

**Files to create:**
- `routes/listing.routes.js`
- `controllers/listingController.js`
- `middleware/upload.middleware.js`

### Phase 3: Chat (Day 7-9)
- [ ] Chat model
- [ ] Get chat messages
- [ ] Send message
- [ ] WebSocket setup for real-time
- [ ] File sharing in chat

**Files to create:**
- `models/Chat.js`
- `routes/chat.routes.js`
- `controllers/chatController.js`
- `socket/chatSocket.js`

### Phase 4: Escrow & Payments (Day 10-12)
- [ ] Escrow model
- [ ] Razorpay integration
- [ ] Initiate payment
- [ ] Confirm delivery
- [ ] Release payment
- [ ] Handle disputes

**Files to create:**
- `models/Escrow.js`
- `routes/escrow.routes.js`
- `controllers/escrowController.js`
- `services/payment.service.js`

### Phase 5: Admin & Reviews (Day 13-15)
- [ ] Admin verification endpoints
- [ ] Fraud alert system
- [ ] Review/Rating model
- [ ] User trust score calculation

**Files to create:**
- `models/Review.js`
- `routes/admin.routes.js`
- `controllers/adminController.js`

---

## API Endpoints to Build

### Authentication Routes
```javascript
// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail, verifyOTP, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-otp', verifyOTP);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
```

### Listing Routes
```javascript
// routes/listing.routes.js
const express = require('express');
const router = express.Router();
const { 
  getListings, 
  getListing, 
  createListing, 
  updateListing, 
  deleteListing 
} = require('../controllers/listingController');
const { protect, requireVerification } = require('../middleware/auth.middleware');
const { uploadImages } = require('../middleware/upload.middleware');

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', protect, requireVerification, uploadImages, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
```

---

## Database Schemas

### User Schema ✅ (Already Created)
```javascript
{
  name: String,
  email: String (unique, .edu validated),
  password: String (hashed),
  college: String,
  year: String,
  isVerified: Boolean,
  trustScore: Number,
  collegeIdUrl: String,
  // ... more fields
}
```

### Listing Schema ✅ (Already Created)
```javascript
{
  seller: ObjectId (ref: User),
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  condition: String,
  category: String,
  images: [String],
  status: String (active/sold/removed),
  // ... more fields
}
```

### Chat Schema (To Create)
```javascript
{
  listingId: ObjectId,
  participants: [ObjectId], // [buyer, seller]
  messages: [{
    senderId: ObjectId,
    content: String,
    timestamp: Date,
    read: Boolean,
    attachments: [String]
  }]
}
```

### Escrow Schema (To Create)
```javascript
{
  listingId: ObjectId,
  buyerId: ObjectId,
  sellerId: ObjectId,
  amount: Number,
  status: String (initiated/held/delivered/released/disputed),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  deliveryConfirmedAt: Date,
  releasedAt: Date
}
```

---

## Testing APIs

### Using Postman/Thunder Client

**1. Signup**
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@iitd.ac.in",
  "password": "Test@123",
  "college": "IIT Delhi",
  "year": "3rd Year"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@iitd.ac.in",
  "password": "Test@123"
}

Response: { token: "jwt-token-here" }
```

**3. Create Listing (Protected)**
```
POST http://localhost:5000/api/listings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "MacBook Air M1",
  "description": "Great condition",
  "price": 55000,
  "originalPrice": 92900,
  "condition": "Good",
  "category": "electronics"
}
```

---

## Integration with Tribhuwan's AI Services

```javascript
// Example: Using AI in your controller
const { suggestPrice } = require('../services/ai/priceIntelligence');

exports.createListing = async (req, res) => {
  try {
    const { title, originalPrice, condition, category } = req.body;
    
    // Get AI price suggestion
    const aiPrice = await suggestPrice({
      title,
      originalPrice,
      condition,
      category
    });
    
    const listing = await Listing.create({
      ...req.body,
      seller: req.user._id,
      aiSuggestedPrice: aiPrice.suggestedPrice,
      aiPriceConfidence: aiPrice.confidence
    });
    
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
```bash
# Solution: Check MongoDB is running
mongod --version

# If using Atlas, verify connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusx
```

### Issue: CORS Error from Frontend
```javascript
// Solution: Update cors config in server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: JWT Token Invalid
```javascript
// Solution: Ensure JWT_SECRET is set in .env
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

---

## Next Steps

1. **Today:**
   - Install MongoDB
   - Run `npm install` in backend folder
   - Test health endpoint: `http://localhost:5000/api/health`

2. **Tomorrow:**
   - Implement signup endpoint
   - Test with Postman

3. **This Week:**
   - Complete authentication APIs
   - Start listing APIs

---

## Resources

- Express.js Docs: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Guide: https://mongoosejs.com/docs/guide.html
- JWT: https://jwt.io/introduction

---

**Need Help?** Message team WhatsApp or call Keshav!
