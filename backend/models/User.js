const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createFirestoreModel } = require('../lib/firestoreModel');

const User = createFirestoreModel({
  collectionName: 'users',
  relationPopulators: {},
  hooks: {
    beforeSave: async (document) => {
      // Avoid double-hashing if the password is already a bcrypt hash
      const isAlreadyHashed = document.password && 
                             typeof document.password === 'string' && 
                             document.password.startsWith('$2') && 
                             document.password.length === 60;

      if (!document._originalPassword || document.password !== document._originalPassword) {
        if (document.password && !isAlreadyHashed) {
          document.password = await bcrypt.hash(document.password, 10);
        }
      }

      document._originalPassword = document.password;
      document._isNew = false;
      return document;
    }
  }
});

User.prototype.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

User.prototype.generateAuthToken = function () {
  return this.generateToken();
};

User.prototype.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000;
  return otp;
};

module.exports = User;
