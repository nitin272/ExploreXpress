const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const famousPlaceSchema = new Schema({
  city: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  imageUrls: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 10'] },
  address: { type: String, required: true, trim: true },
  link: { type: String, required: true, trim: true },
  timing: { type: String, required: true, trim: true },
  cost: { type: String, required: true, trim: true }
}, { timestamps: true, collection: 'Famous-Places' });

function arrayLimit(val) {
  return val.length <= 10;
}

const FamousPlace = mongoose.model('Famous-Places', famousPlaceSchema);

module.exports = FamousPlace;
