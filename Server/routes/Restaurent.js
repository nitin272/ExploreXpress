
const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('../Models/Restaurent');
const app = express();

app.get('/restaurants', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        next(error); 
    }
});



module.exports = app;
