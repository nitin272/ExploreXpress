const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    id: { type: String, unique: true, sparse: true },
    city: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    rating: { type: String, default: "Not Rated", trim: true },
    address: { type: String, required: true, trim: true },
    range: { type: String, trim: true },
    cuisine: { type: String, trim: true },
    imageUrls: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 10'] }
}, { timestamps: true, collection: 'Restaurant' });

function arrayLimit(val) {
  return val.length <= 10;
}

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
