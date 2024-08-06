const Hotel = require('../Modals/Hotel');
const { uploadOnCloudinary,deleteFromCloudinary } = require("../utils/Cloudinary");



exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


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



exports.createHotel = async (req, res) => {
    try {
        const files = req.files; // Array of file objects
        const filePaths = files.map(file => file.path); // Extract paths from file objects

        const imageUrls = await uploadOnCloudinary(filePaths); // Upload files to Cloudinary and get URLs

        const hotel = new Hotel({
            ...req.body,
            imageUrls: imageUrls
        });

        const newHotel = await hotel.save();
        res.status(201).json(newHotel);
    } catch (error) {
        console.error('Error creating hotel:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const files = req.files;
        let imageUrls = [];

        const existingHotel = await Hotel.findById(hotelId);
        if (!existingHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }


        if (existingHotel.imageUrls) {
            imageUrls = existingHotel.imageUrls;
        }


        if (files && files.length > 0) {
            const filePaths = files.map(file => file.path);
            const newImageUrls = await uploadOnCloudinary(filePaths);
            imageUrls = [...imageUrls, ...newImageUrls];
            console.log('Images uploaded to Cloudinary:', newImageUrls);
        }


        const updateData = { ...req.body, imageUrls: imageUrls };
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true, runValidators: true });

        res.json(updatedHotel);
    } catch (error) {
        console.error('Error updating hotel:', error.message);
        res.status(400).json({ message: error.message });
    }
};
exports.deleteHotelImage = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { imageUrls } = req.body;

        console.log(`Received request to delete images from hotel: ${hotelId}`);
        console.log(`Image URLs to delete: ${imageUrls}`);

        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            console.error('No image URLs provided or imageUrls is not an array');
            return res.status(400).json({ message: 'No image URLs provided' });
        }

        const existingHotel = await Hotel.findById(hotelId);
        if (!existingHotel) {
            console.error(`Hotel not found: ${hotelId}`);
            return res.status(404).json({ message: 'Hotel not found' });
        }

        if (!Array.isArray(existingHotel.imageUrls)) {
            console.error('Hotel image URLs are not in the expected format');
            
            return res.status(500).json({ message: 'Hotel image URLs not in expected format' });

        }

        for (const imageUrl of imageUrls) {
            if (!existingHotel.imageUrls.includes(imageUrl)) {
                console.error(`Image not found in hotel: ${imageUrl}`);
                return res.status(404).json({ message: `Image not found in hotel: ${imageUrl}` });
            }

            await deleteFromCloudinary(imageUrl);

            existingHotel.imageUrls = existingHotel.imageUrls.filter(url => url !== imageUrl);
        }

        await existingHotel.save();

        console.log(`Images deleted successfully from hotel: ${hotelId}`);
        res.json({ message: 'Image(s) deleted successfully', updatedImageUrls: existingHotel.imageUrls });
    } catch (error) {
        console.error('Error deleting hotel image:', error.message);
        res.status(500).json({ message: error.message });
    }
};

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