require('dotenv').config();
const { db } = require('./config/firestore');
const bcrypt = require('bcryptjs');

async function test() {
  const snapshot = await db.collection('users').where('email', '==', 'tester@campusx.test').get();
  if (snapshot.empty) {
    console.log('User not found');
    return;
  }
  const user = snapshot.docs[0].data();
  console.log('User found:', user.email);
  console.log('Password hash:', user.password);
  
  const isMatch = await bcrypt.compare('Test1234!', user.password);
  console.log('Matches Test1234!:', isMatch);
}

test();
