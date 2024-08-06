const express = require('express');
const router = express.Router();
const multer = require('multer'); // If you're using multer for file uploads
const PlacesController = require('../controller/PlaceController');

// Multer configuration for file uploads
const upload = require('../middleware/upload') // Adjust dest as per your file storage needs

// Routes for handling places
router.get('/places', PlacesController.getAllPlaces);
router.get('/places/:id', PlacesController.getPlaceById);
router.post('/places', upload.array('images', 5), PlacesController.createPlace); // Example: 'images' is the field name for files, and 5 is the max number of files
router.put('/places/:id', upload.array('images', 5), PlacesController.updatePlace); // Example: 'images' is the field name for files, and 5 is the max number of files
router.delete('/places/:id', PlacesController.deletePlace);
router.delete('/places/:placeId/images', PlacesController.deletePlaceImage); // Route to delete images from a place

module.exports = router;
