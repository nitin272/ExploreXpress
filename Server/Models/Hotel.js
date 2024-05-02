const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    room_number: String,

});

const hotelSchema = new Schema({
    id: String,
    city: String,
    name: String,
  
    rating: String,
    price: Number,
    features: [String],
    address: String,
    coordinates: String,
}, { timestamps: true, collection: 'Hotel' });

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
