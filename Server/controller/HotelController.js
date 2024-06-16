const Hotel = require('../Models/Hotel');

// Get all hotels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get a single hotel by ID
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new hotel
exports.createHotel = async (req, res) => {
    const hotel = new Hotel(req.body);
    try {
        const newHotel = await hotel.save();
        res.status(201).json(newHotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a hotel
exports.updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.hotelId, req.body, { new: true });
        res.json(updatedHotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a hotel
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ message: 'Hotel deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
