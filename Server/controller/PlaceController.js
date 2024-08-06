const Places = require('../Modals/Places');
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/Cloudinary");

// Get all places
exports.getAllPlaces = async (req, res) => {
    try {
        const places = await Places.find({});
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get a single place by ID
exports.getPlaceById = async (req, res) => {
    try {
        const place = await Places.findById(req.params.id);
        if (place) {
            res.json(place);
        } else {
            res.status(404).json({ message: 'Place not found' });
        }
    } catch (error) {
        console.error('Error fetching place by ID:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Create a new place
exports.createPlace = async (req, res) => {
    try {
        const files = req.files; // Array of file objects
        const filePaths = files.map(file => file.path); // Extract paths from file objects

        const imageUrls = await uploadOnCloudinary(filePaths); // Upload files to Cloudinary and get URLs

        const place = new Places({
            ...req.body,
            imageUrls: imageUrls
        });

        const newPlace = await place.save();
        res.status(201).json(newPlace);
    } catch (error) {
        console.error('Error creating place:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Update an existing place
exports.updatePlace = async (req, res) => {
    try {
        const placeId = req.params.id;
        const files = req.files;
        let imageUrls = [];

        const existingPlace = await Places.findById(placeId);
        if (!existingPlace) {
            return res.status(404).json({ message: 'Place not found' });
        }

        if (existingPlace.imageUrls) {
            imageUrls = existingPlace.imageUrls;
        }

        if (files && files.length > 0) {
            const filePaths = files.map(file => file.path);
            const newImageUrls = await uploadOnCloudinary(filePaths);
            imageUrls = [...imageUrls, ...newImageUrls];
            console.log('Images uploaded to Cloudinary:', newImageUrls);
        }

        const updateData = { ...req.body, imageUrls: imageUrls };
        const updatedPlace = await Places.findByIdAndUpdate(placeId, updateData, { new: true, runValidators: true });

        res.json(updatedPlace);
    } catch (error) {
        console.error('Error updating place:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Delete an image from a place
exports.deletePlaceImage = async (req, res) => {
    try {
        const { placeId } = req.params;
        let { imageUrls } = req.body;

        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            console.error('No image URLs provided or imageUrls is not an array');
            return res.status(400).json({ message: 'No image URLs provided' });
        }

        const existingPlace = await Places.findById(placeId);
        if (!existingPlace) {
            console.error(`Place not found: ${placeId}`);
            return res.status(404).json({ message: 'Place not found' });
        }

        if (!Array.isArray(existingPlace.imageUrls)) {
            console.error('Place image URLs are not in the expected format');
            
            return res.status(500).json({ message: 'Place image URLs not in expected format' });
        }

        const imagesToDelete = imageUrls.filter(imageUrl => existingPlace.imageUrls.includes(imageUrl));
        if (imagesToDelete.length === 0) {
            console.error('None of the provided image URLs exist in the place');
            return res.status(404).json({ message: 'None of the provided image URLs exist in the place' });
        }

        for (const imageUrl of imagesToDelete) {
            await deleteFromCloudinary(imageUrl);
            existingPlace.imageUrls = existingPlace.imageUrls.filter(url => url !== imageUrl);
        }

        await existingPlace.save();

        console.log(`Images deleted successfully from place: ${placeId}`);
        res.json({ message: 'Image(s) deleted successfully', updatedImageUrls: existingPlace.imageUrls });
    } catch (error) {
        console.error('Error deleting place image:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Delete a place
exports.deletePlace = async (req, res) => {
    try {
        const place = await Places.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json({ message: 'Place deleted' });
    } catch (error) {
        console.error('Error deleting place:', error.message);
        res.status(500).json({ message: error.message });
    }
};
