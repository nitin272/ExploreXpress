const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    minlength: [3, 'Username must be at least 3 characters long'], 
    maxlength: [30, 'Username must be less than 30 characters'],
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required']

  },

  imageUrl: {
    
    type: String,

    default: function() {

      const initial = encodeURIComponent(this.username[0].toUpperCase());
      return `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&length=1`;
    }
  },
  coverImageUrl: String
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (!this.imageUrl) {
    const initial = encodeURIComponent(this.email[0].toUpperCase());
    this.imageUrl = `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&length=1`;
  }
  next();
});

// Check if the model is already defined before defining it again
const User = mongoose.models.User || mongoose.model('user', userSchema, 'Manual');

module.exports = User;
