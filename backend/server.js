const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const deploymentMarker = require('./deployment-marker');

// Load environment variables
dotenv.config();

const http = require('http');

// Initialize express app
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
        // Allow localhost and Cloud Run origins
      if (!origin || 
          origin.includes('localhost') || 
          origin.includes('.run.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }
});

app.set('io', io);

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`👤 Socket ${socket.id} joined chat room: ${chatId}`);
    // Log all rooms this socket is in
    console.log(`   Rooms for ${socket.id}:`, Array.from(socket.rooms));
  });

  socket.on("send_message", (newMessage) => {
    const { chatId } = newMessage;
    console.log(`📤 Direct socket message received for room ${chatId}:`, newMessage);
    io.to(chatId).emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Connect to MongoDB
connectDB();

// Log server initialization
console.log('==========================================');
console.log(`🚀 CampusX Server v${deploymentMarker.version} Starting...`);
console.log(`📅 Deployed: ${deploymentMarker.deployedAt}`);
console.log(`🕐 Started: ${new Date().toISOString()}`);
console.log('==========================================');

// Middleware
app.use(helmet()); // Security headers

// CORS Configuration - Allow Cloud Run and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list, matches Cloud Run pattern, or localhost
    if (allowedOrigins.includes(origin) ||
      origin.includes('.run.app') ||
      origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with increased limit for images
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CampusX API is running',
    timestamp: new Date().toISOString(),
    database: 'firestore',
    environment: process.env.NODE_ENV || 'development',
    version: deploymentMarker.version,
    deployed: deploymentMarker.deployedAt
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/listings', require('./routes/listing.routes'));
app.use('/api/chat', require('./routes/chat.routes')); // Changed from /api/chats to /api/chat
app.use('/api/ai', require('./routes/ai.routes'));
// app.use('/api/escrow', require('./routes/escrow.routes'));
// app.use('/api/users', require('./routes/user.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => { // Changed app.listen to server.listen
  console.log('🚀 CampusX API running on port ' + PORT);
  console.log('📝 Environment: ' + process.env.NODE_ENV);
});

module.exports = app;
