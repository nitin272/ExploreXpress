const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    image: String,
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
      
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
