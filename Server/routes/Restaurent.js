const express = require('express');
const router = express.Router();
const restaurantController = require('../controller/Restaurant.controller');
const upload = require('../middleware/upload');

router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);
router.post('/restaurants', upload.array('images', 10), restaurantController.createRestaurant);
router.put('/restaurants/:id', upload.array('images', 10), restaurantController.updateRestaurant);

router.delete('/restaurants/:id', restaurantController.deleteRestaurant);
router.delete('/restaurants/:id/images', restaurantController.deleteRestaurantImage); // New endpoint for deleting images

module.exports = router;
