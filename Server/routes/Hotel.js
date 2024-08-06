const express = require('express');
const router = express.Router();
const hotelController = require('../controller/HotelController');
const  upload  = require('../middleware/upload');



router.get('/hotels', hotelController.getAllHotels);
router.get('/hotel/:hotelId', hotelController.getHotelById);

router.post('/hotels', upload.array('images', 5), hotelController.createHotel);


router.put('/hotels/:hotelId', upload.array('images', 5), hotelController.updateHotel);



router.delete('/hotels/:hotelId/images', hotelController.deleteHotelImage);


router.delete('/hotels/:hotelId', hotelController.deleteHotel);


module.exports = router;