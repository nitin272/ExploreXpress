const Places = require('../Modals/Places');

// Get all places
exports.getAllPlaces = async (req, res, next) => {
    try {
        const places = await Places.find({});
        res.json(places);
    } catch (error) {
        next(error);
    }
};


// Get a single place by ID
exports.getPlaceById = async (req, res, next) => {
    try {
        const place = await Places.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};

// Create a new place

exports.createPlace = async (req, res, next) => {
    const place = new Places(req.body);
    try {
        const newPlace = await place.save();
        res.status(201).json(newPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
        next(error);
    }
};

// Update an existing place
exports.updatePlace = async (req, res, next) => {
    try {
        const updatedPlace = await Places.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlace) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json(updatedPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
        next(error);
    }
};

// Delete a place
exports.deletePlace = async (req, res, next) => {
    try {
        const place = await Places.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(204).json({ message: 'Place deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};
