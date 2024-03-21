// modelRoutes.js

const express = require('express');
const route = express.route();
const Model = require('../Models/Model');

// Define the GET endpoint
route.get('/', (req, res) => {
  Model.find({})
    .lean()
    .then(data => {


      
      res.json(data);
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    });
});

module.exports = route;
