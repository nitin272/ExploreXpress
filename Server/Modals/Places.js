const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const famousPlaceSchema = new Schema({
  city: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: { type: String, required: true }, 
  link: { type: String, required: true },
  timing: { type: String, required: true },
  cost: { type: String, required: true } 
}, { timestamps: true, collection: 'Famous-Places' });


const FamousPlace = mongoose.model('Famous-Places', famousPlaceSchema);


module.exports = FamousPlace;
