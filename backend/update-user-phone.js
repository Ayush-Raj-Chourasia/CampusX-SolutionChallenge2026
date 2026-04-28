/**
 * Quick script to update user phone number
 * Run with: node backend/update-user-phone.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function updatePhone() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: 'testuser1@soa.ac.in' });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log(`📱 Current phone: ${user.phone || 'Not set'}`);
    
    // Update phone number
    user.phone = '9876543210';
    user.department = 'Computer Science';
    user.year = '4th Year';
    await user.save();

    console.log(`✅ Updated phone to: ${user.phone}`);
    console.log(`✅ Updated department to: ${user.department}`);
    console.log(`✅ Updated year to: ${user.year}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

updatePhone();
