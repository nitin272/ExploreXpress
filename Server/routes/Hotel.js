const express = require('express');
const mongoose = require('mongoose');
const Hotel = require('../Models/Hotel'); 
const app = express();



app.get('/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;