const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
    tableID: String,
    seatingCapacity: Number,
    availability: Boolean
});

const restaurantSchema = new Schema({
    id: String,
    city: String,
    name: String,
    rating: String,
    address: String,
    coordinates: String,
    tables: [tableSchema]
}, { timestamps: true, collection: 'Restaurent' });

const Restaurant = mongoose.model('Restaurent', restaurantSchema);
module.exports = Restaurant;
