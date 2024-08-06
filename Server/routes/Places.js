const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const PlacesController = require('../controller/PlaceController');


const upload = require('../middleware/upload') 


router.get('/places', PlacesController.getAllPlaces);
router.get('/places/:id', PlacesController.getPlaceById);

router.post('/places', upload.array('images', 5), PlacesController.createPlace);

router.put('/places/:id', upload.array('images', 5), PlacesController.updatePlace); 
router.delete('/places/:id', PlacesController.deletePlace);

router.delete('/places/:placeId/images', PlacesController.deletePlaceImage); 

module.exports = router;
