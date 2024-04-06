const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  imageUrl: { type: String },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (!this.imageUrl) {
    const initial = encodeURIComponent(this.email[0].toUpperCase()); // Use the first letter of the email
    this.imageUrl = `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&length=1`;
  }
  next();
});


const User = mongoose.model('User', userSchema, 'Login');
module.exports = User;
