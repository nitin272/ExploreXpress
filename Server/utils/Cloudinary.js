// Cloudinary.js

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePaths) => {
    try {
        const promises = filePaths.map(async (filePath) => {
            const response = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto"
            });
            fs.unlinkSync(filePath); // Remove local file after upload
            return response.secure_url; // Return the secure URL from Cloudinary
        });

        const results = await Promise.all(promises);
        return results; // Return array of secure URLs from Cloudinary
    } catch (error) {
        filePaths.forEach(filePath => {
            fs.unlinkSync(filePath); // Cleanup in case of error
        });
        throw error;
    }
};

const deleteFromCloudinary = async (imageUrl) => {
    try {
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public_id from URL
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });
        return result;
    } catch (error) {
        throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
    }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
