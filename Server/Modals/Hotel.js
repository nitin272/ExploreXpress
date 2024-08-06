const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    city: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: String, default: "Not Rated" },
    price: { type: Number, required: true, min: 0 },
    features: { type: [String] },
    address: { type: String, required: true },
    coordinates: { type: String }, 
    imageUrls: { type: [String] }
}, { timestamps: true, collection: 'Hotel' });

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
