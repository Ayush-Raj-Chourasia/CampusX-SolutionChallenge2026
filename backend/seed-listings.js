/**
 * Seed script to add sample listings to the database
 * Run with: node backend/seed-listings.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');

const sampleListings = [
  {
    title: "MacBook Air M1 2020",
    description: "Selling my MacBook Air M1 as I'm upgrading to the new M3 model. The laptop is in excellent condition with no scratches or dents. Battery health is at 92%. Comes with original charger and box. Perfect for coding, design work, or everyday use. Great for any CS/IT student.",
    price: 55000,
    originalPrice: 92900,
    condition: "Good",
    category: "electronics",
    images: ["💻"],
    location: "IIT Delhi",
    tags: ["macbook", "laptop", "m1", "apple"]
  },
  {
    title: "Engineering Mathematics Textbook",
    description: "BS Grewal Engineering Mathematics book in excellent condition. All pages intact, no writings or marks. Perfect for first and second year engineering students.",
    price: 450,
    originalPrice: 800,
    condition: "Like New",
    category: "books",
    images: ["📚"],
    tags: ["textbook", "engineering", "mathematics"]
  },
  {
    title: "Hero Sprint Hybrid Cycle",
    description: "Well-maintained hybrid cycle, perfect for campus commute. 21-speed gears, disc brakes, comfortable seat. Used for 8 months only. Selling because graduating soon.",
    price: 4500,
    originalPrice: 8000,
    condition: "Good",
    category: "cycles",
    images: ["🚲"],
    tags: ["cycle", "bicycle", "hybrid", "hero"]
  },
  {
    title: "Wildcraft Backpack",
    description: "Spacious wildcraft backpack with laptop compartment. Multiple pockets, water-resistant. Used for 6 months, in great condition.",
    price: 500,
    originalPrice: 800,
    condition: "Good",
    category: "other",
    images: ["🎒"],
    tags: ["backpack", "wildcraft", "bag"]
  },
  {
    title: "Acoustic Guitar with Bag",
    description: "Yamaha F310 acoustic guitar in excellent condition. Comes with padded carry bag, extra strings, and picks. Perfect for beginners and intermediate players.",
    price: 6000,
    originalPrice: 10500,
    condition: "Like New",
    category: "instruments",
    images: ["🎸"],
    tags: ["guitar", "yamaha", "acoustic", "music"]
  }
];

async function seedListings() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find testuser1@soa.ac.in user to be the seller
    const seller = await User.findOne({ email: 'testuser1@soa.ac.in' });
    
    if (!seller) {
      console.log('❌ User testuser1@soa.ac.in not found.');
      console.log('ℹ️  Available users:');
      const users = await User.find({}, 'name email college').limit(5);
      users.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.college}`));
      process.exit(1);
    }

    console.log(`📦 Using seller: ${seller.name} (${seller.email})`);

    // Clear existing listings for this seller
    const deleted = await Listing.deleteMany({ seller: seller._id });
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing listings for this seller`);

    // Create listings
    const listingsToCreate = sampleListings.map(listing => ({
      ...listing,
      seller: seller._id
    }));

    const createdListings = await Listing.insertMany(listingsToCreate);
    console.log(`✅ Created ${createdListings.length} sample listings!`);

    createdListings.forEach((listing, index) => {
      console.log(`  ${index + 1}. ${listing.title} - ₹${listing.price}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log(`🔗 Listings are now available in ${seller.college} marketplace`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the seed function
seedListings();
