const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { collection: 'All' }); // Explicitly specifying the collection name as "All"

const model = mongoose.model('Example', exampleSchema, 'All');

module.exports = model;
