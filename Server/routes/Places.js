const express = require('express');
const router = express.Router();
const PlacesController = require('../controller/PlaceController');

// Routes for handling places
router.get('/places', PlacesController.getAllPlaces);
router.get('/places/:id', PlacesController.getPlaceById);


router.post('/places', PlacesController.createPlace);

router.put('/places/:id', PlacesController.updatePlace);

router.delete('/places/:id', PlacesController.deletePlace);

module.exports = router;

