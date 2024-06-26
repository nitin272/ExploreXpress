const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 

    minlength: [3, 'Username must be at least 3 characters long'], 
    maxlength: [30, 'Username must be less than 30 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid username. Only letters, numbers, and underscores are allowed.`
    }
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    validate: {
      validator: function(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      },
      message: () => `Password must be stronger. It should contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.`
    }
  },
  imageUrl: String,

  Hotel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  Places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  Restaurant: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }]
  
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

const User = mongoose.model('user', userSchema, 'Manual');
module.exports = User;