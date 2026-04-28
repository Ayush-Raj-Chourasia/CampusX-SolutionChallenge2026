# 🎓 CampusX - India's Verified Student Marketplace

> A safe, AI-powered marketplace exclusively for verified college students with escrow payment protection.

---

## 🚀 Project Overview

**CampusX** is India's first student-only marketplace that solves the critical problem of unsafe campus trading. Every user is verified through college email and ID, transactions are protected by escrow payments, and our AI ensures fair pricing.

### 🎯 Core Features

- ✅ **College Email Verification** - Only .edu domain students can join
- ✅ **AI-Powered ID Verification** - Automated college ID validation
- ✅ **Escrow Payment System** - Money held safely until delivery confirmation
- ✅ **AI Price Intelligence** - Market-based fair price suggestions
- ✅ **AI Negotiator** - Automated price negotiation in chat
- ✅ **Encrypted Chat** - Real-time messaging with end-to-end encryption
- ✅ **Trust Scores** - Reputation system for buyers and sellers
- ✅ **Admin Dashboard** - Fraud detection and user management

---


## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Node.js** + **Express.js** - REST API server
- **Google Cloud Firestore** - Database (replaced MongoDB)
- Firestore adapter (Mongoose-like shim) used in backend models
- **JWT** - Authentication
- **Socket.io** - Real-time chat
- **Google Cloud Storage** - Image storage (replaced Cloudinary)
- **Razorpay** - Payment gateway

### AI Services
- **Gemini / Vertex AI** - AI Negotiator & Price Intelligence
- **Gemini Vision / Vertex AI** - College ID Verification
- Custom fraud detection algorithms

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Google Cloud account with Firestore & Cloud Storage access (or local ADC configured)
- Vertex AI / Gemini access (optional, for AI features)
- Razorpay test account

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Ayush-Raj-Chourasia/CampusX-SolutionChallenge2026.git
cd CampusX-SolutionChallenge2026

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your backend URL
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit `.env` with your credentials (see below). For local development,
# configure Google Application Default Credentials (ADC) or provide a
# service account key via `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

# Start server
npm run dev
```

Backend will run on `http://localhost:5000`

---

## 🗂️ Project Structure

```
campusX/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── landing/   # Landing page sections
│   │   │   ├── ui/        # shadcn components
│   │   │   └── icons/     # Custom icons
│   │   ├── pages/         # Route pages
│   │   │   ├── Index.tsx       # Landing page
│   │   │   ├── Marketplace.tsx # Browse listings
│   │   │   ├── Product.tsx     # Product details
│   │   │   ├── Chat.tsx        # Messaging
│   │   │   ├── Sell.tsx        # Create listing
│   │   │   ├── Login.tsx       # Authentication
│   │   │   ├── Signup.tsx      # Registration
│   │   │   └── AdminDashboard.tsx
│   │   ├── stores/        # Zustand state
│   │   ├── lib/           # Utilities
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/
│   ├── server.js          # Entry point
│   ├── config/            # DB, Cloudinary config
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Chat.js
│   │   ├── Escrow.js
│   │   └── Review.js
│   ├── routes/            # API endpoints
│   │   ├── auth.routes.js
│   │   ├── listing.routes.js
│   │   ├── chat.routes.js
│   │   ├── escrow.routes.js
│   │   └── admin.routes.js
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, error handling
│   ├── services/          # AI services
│   │   └── ai/
│   │       ├── negotiator.js
│   │       ├── priceIntelligence.js
│   │       ├── idVerification.js
│   │       └── fraudDetection.js
│   └── package.json
│
├── PROTOTYPE_PLAN.md      # Detailed implementation guide
└── README.md              # This file
```

---

## 🔑 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Firestore / Google Cloud
# If running locally, set GOOGLE_APPLICATION_CREDENTIALS to your
# service account JSON key file path or configure ADC via `gcloud auth application-default login`.
GCS_BUCKET_NAME=your-gcs-bucket-name

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=campusx.noreply@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# AI Services
GOOGLE_API_KEY=your-google-api-key
GOOGLE_AI_MODEL=gemini-1.5-flash
```

---

## 🚀 API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/verify-email    - Send OTP to email
POST   /api/auth/verify-otp      - Verify OTP code
GET    /api/auth/me              - Get current user
POST   /api/auth/logout          - Logout user
```

### Listings
```
GET    /api/listings             - Get all listings (with filters)
GET    /api/listings/:id         - Get single listing
POST   /api/listings             - Create new listing
PUT    /api/listings/:id         - Update listing
DELETE /api/listings/:id         - Delete listing
```

### Chat
```
GET    /api/chats/:listingId     - Get chat messages
POST   /api/chats/:listingId/message - Send message
WebSocket: /ws/chat               - Real-time messaging
```

### Escrow
```
POST   /api/escrow/initiate      - Start escrow transaction
POST   /api/escrow/confirm       - Confirm delivery
POST   /api/escrow/release       - Release payment
GET    /api/escrow/:id/status    - Get transaction status
```

### AI Services
```
POST   /api/ai/price-suggest     - Get AI price suggestion
POST   /api/ai/verify-id         - Verify college ID
POST   /api/ai/negotiate         - AI negotiation
GET    /api/ai/fraud-check/:listingId - Fraud detection
```

### Admin
```
GET    /api/admin/verifications  - Pending verifications
PUT    /api/admin/verify/:userId - Approve user
GET    /api/admin/fraud-alerts   - Active fraud alerts
PUT    /api/admin/ban/:userId    - Ban user
```

---

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm run test

# Run backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

---

## 🌐 Deployment

Both frontend and backend are deployed to **Google Cloud Run** via Cloud Build CI/CD.

### Automated Deployment (Cloud Build)

Push to `main` branch and Cloud Build automatically:
1. Builds backend from `backend/Dockerfile`
2. Builds frontend from root `Dockerfile` (serves via Node.js with `serve`)
3. Pushes both images to Artifact Registry (asia-south1)
4. Deploys both services to Cloud Run (asia-south1 region)

**Services:**
- **Backend API**: `campusx-backend` Cloud Run service → `VITE_API_URL` env var
- **Frontend Web**: `campusx-frontend` Cloud Run service → publicly accessible

**Build config:** [cloudbuild.yaml](cloudbuild.yaml) — defines all steps.

### Manual Cloud Run Deployment (if needed)

```bash
# Build backend
gcloud builds submit --tag asia-south1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/campusx-solutionchallenge2026/campusx-backend:latest \
  --project=$PROJECT_ID \
  -f backend/Dockerfile \
  backend/

# Deploy backend
gcloud run deploy campusx-backend \
  --image asia-south1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/campusx-solutionchallenge2026/campusx-backend:latest \
  --platform managed \
  --region asia-south1 \
  --project=$PROJECT_ID

# Build frontend
gcloud builds submit --tag asia-south1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/campusx-solutionchallenge2026/campusx-frontend:latest \
  --project=$PROJECT_ID \
  -f Dockerfile \
  .

# Deploy frontend
gcloud run deploy campusx-frontend \
  --image asia-south1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/campusx-solutionchallenge2026/campusx-frontend:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --project=$PROJECT_ID
```

Replace `$PROJECT_ID` with `innate-benefit-444822-h1`.

---

## 📱 Demo Credentials

For testing the prototype:

```
Email: demo@iitd.ac.in
Password: Demo@123

Admin Access:
Email: admin@campusx.com
Password: Admin@123
```

---

## 🎥 Demo Video

[Watch our prototype demo](https://youtu.be/demo-link)

---

## 📄 Documentation

- [Implementation Plan](./PROTOTYPE_PLAN.md) - Detailed task breakdown
- [API Documentation](./docs/API.md) - Complete API reference
- [User Guide](./docs/USER_GUIDE.md) - How to use CampusX

---

## 🐛 Known Issues & Future Enhancements

### Current Limitations (Prototype Phase)
- Payment integration is in test mode
- AI features may have rate limits
- Limited fraud detection algorithms
- Basic admin dashboard

### Planned Features
- Mobile apps (React Native)
- Advanced AI fraud detection
- Multi-language support
- Campus-specific features (hostel rooms, event tickets)
- Integration with college ERP systems
- Video verification for high-value items

---

## 🤝 Contributing

This is a competition prototype. Team members:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📜 License

This project is part of a competition submission. All rights reserved by Team CampusX.

---

## 🙏 Acknowledgments

- shadcn/ui for amazing component library
- OpenAI for AI capabilities
- All open-source libraries used in this project

---

**Made with by Team IQ Zero**  
*Building a safer campus marketplace for students across India*


