const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const restaurantSchema = new Schema({
    id: String,
    city: String,
    name: String,
    rating: String,
    address: String,
    coordinates: String,
    Range: String,
    cuisine: String,

}, { timestamps: true, collection: 'Restaurent' });

const Restaurant = mongoose.model('Restaurent', restaurantSchema);
module.exports = Restaurant;
