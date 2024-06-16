const express = require('express');
const router = express.Router();
const hotelController = require('../controller/HotelController');




router.get('/hotels', hotelController.getAllHotels);
router.get('/hotel/:hotelId', hotelController.getHotelById);
router.post('/hotels', hotelController.createHotel);
router.put('/hotels/:hotelId', hotelController.updateHotel);
router.delete('/hotels/:hotelId', hotelController.deleteHotel);

module.exports = router;

