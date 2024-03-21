const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // This will be the display name for Google users
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google sign-in users
  googleId: { type: String, unique: true, sparse: true }, // Sparse indexing allows for unique values and nulls
});

// Hash the password before saving, if it has been modified (and is not null for Google sign-in users)
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema, 'Login');
module.exports = User;
