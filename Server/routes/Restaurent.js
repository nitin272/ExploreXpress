const express = require('express');
const router = express.Router();
const RestaurantController = require('../controller/Restaurant.controller');

router.get('/restaurants', RestaurantController.getAllRestaurants);
router.get('/restaurants/:id', RestaurantController.getRestaurantById);

router.post('/restaurants', RestaurantController.createRestaurant);

router.put('/restaurants/:id', RestaurantController.updateRestaurant);

router.delete('/restaurants/:id', RestaurantController.deleteRestaurant);

module.exports = router;
