const express = require('express');
const app = express();
const Places = require('../Models/Places');

app.get('/places', async (req, res, next) => {
    try {
        const places = await Places.find({}); // This line is problematic
        res.json(places);
    } catch (error) {
        next(error);
    }
});


module.exports = app;