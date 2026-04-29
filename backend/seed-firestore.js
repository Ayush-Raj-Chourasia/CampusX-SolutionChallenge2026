/**
 * Seed Firestore with missing collections and test users.
 *
 * Run:  node backend/seed-firestore.js
 *
 * This script creates:
 *   - Test users (SOA, KIIT, admin)
 *   - Sample listings
 *   - Sample chats & messages
 *   - Escrow collection placeholder
 */

const { db } = require('./config/firestore');
const bcrypt = require('bcryptjs');

const TEST_PASSWORD = 'Test1234!';

async function seed() {
  console.log('🌱 Starting Firestore seed...\n');

  // ---- 1. Hash the test password ----
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  // ---- 2. Create / upsert test users ----
  const testUsers = [
    {
      name: 'SOA Student',
      email: 'testuser@soa.ac.in',
      password: hashedPassword,
      _originalPassword: hashedPassword,
      college: 'SOA University',
      department: 'CSE',
      year: '3rd Year',
      phone: '9876543210',
      verified: true,
      trustScore: 95,
      profilePicture: null,
      role: 'user',
      isActive: true,
      theme: 'dark',
    },
    {
      name: 'KIIT Student',
      email: 'testuser@kiit.ac.in',
      password: hashedPassword,
      _originalPassword: hashedPassword,
      college: 'KIIT University',
      department: 'ECE',
      year: '2nd Year',
      phone: '9876543211',
      verified: true,
      trustScore: 90,
      profilePicture: null,
      role: 'user',
      isActive: true,
      theme: 'light',
    },
    {
      name: 'CampusX Admin',
      email: 'admin@campusx.com',
      password: hashedPassword,
      _originalPassword: hashedPassword,
      college: 'CampusX HQ',
      department: 'Admin',
      year: 'N/A',
      phone: '9999900000',
      verified: true,
      trustScore: 100,
      profilePicture: null,
      role: 'admin',
      isActive: true,
      theme: 'dark',
    },
  ];

  const userIds = {};

  for (const user of testUsers) {
    // Check if user already exists
    const snap = await db.collection('users')
      .where('email', '==', user.email)
      .limit(1)
      .get();

    if (!snap.empty) {
      const existingDoc = snap.docs[0];
      userIds[user.email] = existingDoc.id;
      // Update password in case it's corrupted
      await existingDoc.ref.update({
        password: hashedPassword,
        _originalPassword: hashedPassword,
      });
      console.log(`  ✅ User exists: ${user.email} (${existingDoc.id}) — password reset`);
    } else {
      const now = new Date().toISOString();
      const docRef = await db.collection('users').add({
        ...user,
        createdAt: now,
        updatedAt: now,
      });
      userIds[user.email] = docRef.id;
      console.log(`  ✅ Created user: ${user.email} (${docRef.id})`);
    }
  }

  // Get existing test users too
  const existingSnap = await db.collection('users').get();
  existingSnap.forEach(doc => {
    const d = doc.data();
    if (d.email && !userIds[d.email]) {
      userIds[d.email] = doc.id;
    }
  });

  console.log('\n📋 User ID Map:', userIds);

  // ---- 3. Create sample listings ----
  const soaUserId = userIds['testuser@soa.ac.in'];
  const kiitUserId = userIds['testuser@kiit.ac.in'];

  const sampleListings = [
    {
      seller: soaUserId,
      title: 'Engineering Mathematics Textbook',
      description: 'B.Tech 1st year Higher Engineering Mathematics by B.S. Grewal. Well maintained, no markings.',
      price: 250,
      originalPrice: 650,
      condition: 'Good',
      category: 'books',
      images: [],
      status: 'active',
      views: 12,
      wishlists: [],
      tags: ['math', 'engineering', 'btech'],
      isFeatured: false,
    },
    {
      seller: kiitUserId,
      title: 'Logitech Wireless Mouse',
      description: 'Logitech M235 wireless mouse. 1 year old, works perfectly. Selling because upgraded.',
      price: 450,
      originalPrice: 999,
      condition: 'Good',
      category: 'electronics',
      images: [],
      status: 'active',
      views: 8,
      wishlists: [],
      tags: ['mouse', 'logitech', 'wireless'],
      isFeatured: false,
    },
    {
      seller: soaUserId,
      title: 'Scientific Calculator Casio FX-991EX',
      description: 'Casio FX-991EX ClassWiz. Used for 1 semester only. Comes with original cover.',
      price: 800,
      originalPrice: 1800,
      condition: 'Like New',
      category: 'electronics',
      images: [],
      status: 'active',
      views: 20,
      wishlists: [],
      tags: ['calculator', 'casio', 'engineering'],
      isFeatured: true,
    },
    {
      seller: kiitUserId,
      title: 'Data Structures & Algorithms Notes',
      description: 'Complete handwritten DSA notes covering arrays, linked lists, trees, graphs, DP. 120 pages.',
      price: 150,
      originalPrice: 0,
      condition: 'Good',
      category: 'notes',
      images: [],
      status: 'active',
      views: 35,
      wishlists: [],
      tags: ['dsa', 'notes', 'cse'],
      isFeatured: false,
    },
    {
      seller: soaUserId,
      title: 'Study Table & Chair Combo',
      description: 'Wooden study table with cushion chair. Perfect for hostel room. Slightly used.',
      price: 2500,
      originalPrice: 5500,
      condition: 'Fair',
      category: 'furniture',
      images: [],
      status: 'active',
      views: 6,
      wishlists: [],
      tags: ['table', 'chair', 'hostel'],
      isFeatured: false,
    },
  ];

  let listingIds = [];
  for (const listing of sampleListings) {
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const ref = await db.collection('listings').add({
      ...listing,
      createdAt: now,
      updatedAt: now,
      expiresAt,
    });
    listingIds.push(ref.id);
    console.log(`  📦 Created listing: "${listing.title}" (${ref.id})`);
  }

  // ---- 4. Create sample chats ----
  const now = new Date().toISOString();

  const chat1Ref = await db.collection('chats').add({
    participants: [soaUserId, kiitUserId],
    listing: listingIds[1], // Logitech Mouse
    lastMessage: 'Is this still available?',
    lastMessageTime: now,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`  💬 Created chat: SOA ↔ KIIT about Logitech Mouse (${chat1Ref.id})`);

  // ---- 5. Create sample messages ----
  const messages = [
    {
      chatId: chat1Ref.id,
      sender: soaUserId,
      content: 'Hey! Is the Logitech mouse still available?',
      image: null,
      read: true,
    },
    {
      chatId: chat1Ref.id,
      sender: kiitUserId,
      content: 'Yes, it is! Are you interested?',
      image: null,
      read: true,
    },
    {
      chatId: chat1Ref.id,
      sender: soaUserId,
      content: 'Can you do ₹400?',
      image: null,
      read: true,
    },
    {
      chatId: chat1Ref.id,
      sender: kiitUserId,
      content: 'How about ₹420? It\'s in great condition.',
      image: null,
      read: false,
    },
  ];

  for (const msg of messages) {
    const msgTime = new Date().toISOString();
    await db.collection('messages').add({
      ...msg,
      createdAt: msgTime,
      updatedAt: msgTime,
    });
  }
  console.log(`  ✉️  Created ${messages.length} messages`);

  // ---- 6. Create escrow collection with a sample doc ----
  const escrowRef = await db.collection('escrows').add({
    listing: listingIds[0],
    buyer: kiitUserId,
    seller: soaUserId,
    amount: 250,
    status: 'completed',
    paymentMethod: 'UPI',
    paymentId: 'pay_demo_001',
    createdAt: now,
    updatedAt: now,
    confirmedAt: now,
    releasedAt: now,
  });
  console.log(`  🔒 Created escrow: ₹250 for "${sampleListings[0].title}" (${escrowRef.id})`);

  // Another escrow in progress
  const escrow2Ref = await db.collection('escrows').add({
    listing: listingIds[2],
    buyer: kiitUserId,
    seller: soaUserId,
    amount: 800,
    status: 'in_escrow',
    paymentMethod: 'UPI',
    paymentId: 'pay_demo_002',
    createdAt: now,
    updatedAt: now,
    confirmedAt: null,
    releasedAt: null,
  });
  console.log(`  🔒 Created escrow: ₹800 for "${sampleListings[2].title}" (${escrow2Ref.id})`);

  console.log('\n✅ Firestore seed complete!');
  console.log('\n📝 Test Credentials:');
  console.log('  ┌──────────────────────────┬────────────────────┬────────────┐');
  console.log('  │ Email                    │ Password           │ Role       │');
  console.log('  ├──────────────────────────┼────────────────────┼────────────┤');
  console.log('  │ tester@campusx.test       │ Test1234!          │ User       │');
  console.log('  │ test@soa.ac.in            │ Test1234!          │ User       │');
  console.log('  │ testuser@soa.ac.in        │ Test1234!          │ User       │');
  console.log('  │ testuser@kiit.ac.in       │ Test1234!          │ User       │');
  console.log('  │ admin@campusx.com         │ Test1234!          │ Admin      │');
  console.log('  └──────────────────────────┴────────────────────┴────────────┘');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
