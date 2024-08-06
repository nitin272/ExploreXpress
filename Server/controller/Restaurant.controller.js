const Restaurant = require('../Modals/Restaurent');
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/Cloudinary");

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
    try {
        const files = req.files;
        const filePaths = files.map(file => file.path);

        const imageUrls = await uploadOnCloudinary(filePaths);

        const restaurant = new Restaurant({
            ...req.body,
            imageUrls: imageUrls
        });

        const newRestaurant = await restaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const files = req.files;
        let imageUrls = [];

        const existingRestaurant = await Restaurant.findById(restaurantId);
        if (!existingRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (existingRestaurant.imageUrls) {
            imageUrls = existingRestaurant.imageUrls;
        }

        if (files && files.length > 0) {
            const filePaths = files.map(file => file.path);
            const newImageUrls = await uploadOnCloudinary(filePaths);
            imageUrls = [...imageUrls, ...newImageUrls];
            console.log('Images uploaded to Cloudinary:', newImageUrls);
        }

        const updateData = { ...req.body, imageUrls: imageUrls };
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true, runValidators: true });

        res.json(updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error.message);
        res.status(400).json({ message: error.message });
    }
};


// Delete restaurant image

exports.deleteRestaurantImage = async (req, res) => {

    try {
        const { id: restaurantId } = req.params;

        let { imageUrls } = req.body;

        console.log(`Received request to delete images from restaurant: ${restaurantId}`);
        console.log(`Image URLs to delete: ${imageUrls}`);

        if (!Array.isArray(imageUrls)) {
            imageUrls = [imageUrls]; // Convert to array if not already
        }

        const existingRestaurant = await Restaurant.findById(restaurantId);
        if (!existingRestaurant) {
            console.error(`Restaurant not found: ${restaurantId}`);
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (!Array.isArray(existingRestaurant.imageUrls)) {
            console.error('Restaurant image URLs are not in the expected format');
            return res.status(500).json({ message: 'Restaurant image URLs not in expected format' });
        }

        // Validate imageUrls to ensure they exist in the restaurant's imageUrls array
        const validImageUrls = imageUrls.filter(url => existingRestaurant.imageUrls.includes(url));
        const invalidImageUrls = imageUrls.filter(url => !existingRestaurant.imageUrls.includes(url));

        // Delete images from Cloudinary and update restaurant document
        for (const imageUrl of validImageUrls) {
            await deleteFromCloudinary(imageUrl);
            existingRestaurant.imageUrls = existingRestaurant.imageUrls.filter(url => url !== imageUrl);
        }

        await existingRestaurant.save();

        console.log(`Images deleted successfully from restaurant: ${restaurantId}`);
        res.json({ message: 'Image(s) deleted successfully', updatedImageUrls: existingRestaurant.imageUrls, invalidImageUrls });
    } catch (error) {
        console.error('Error deleting restaurant image:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {

            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
