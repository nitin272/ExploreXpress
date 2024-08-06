const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Modals/Login');
const userdb = require("../Modals/Google");
const secretKey = "Nitin";
const { uploadOnCloudinary, deleteFromCloudinary} = require('../utils/Cloudinary');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({
      username: name,
      email,
      password,
    });

    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.json({ message: "Login successful", token, userId: user._id });
    } else {
      res.status(401).json({ message: "Invalid password or email" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const usersFromFirstDB = await User.find({}).select('-password');
    const usersFromSecondDB = await userdb.find({}).select('-password');
    const combinedUsers = usersFromFirstDB.concat(usersFromSecondDB);
    res.json(combinedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password') || await userdb.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({name: user.username, ...user.toObject()});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

exports.verifyPassword = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ message: "Password verified successfully" });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Error verifying password", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      username: updates.name,
      email: updates.email
    }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


exports.uploadCoverImage = async (req, res) => {
  const userId = req.params.userId; // Extract userId from route parameters
  const file = req.file; // Assuming you're using multer for file upload

  if (!userId || !file) {
      return res.status(400).json({ error: 'Missing userId or coverImage file' });
  }

  try {
      const imageUrl = await uploadOnCloudinary(file.path);
      console.log('Cloudinary Image URL:', imageUrl);

      const updatedUser = await User.findByIdAndUpdate(userId, { coverImageUrl: imageUrl }, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Cover image uploaded successfully', user: updatedUser });
  } catch (error) {
      console.error('Error uploading cover image:', error);
      res.status(500).json({ error: 'Server error. Failed to upload cover image' });
  }
};


exports.deleteCoverImage = async (req, res) => {
  const userId = req.params.userId; // Extract userId from route parameters

  try {
      // Find user to get coverImageUrl
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const imageUrl = user.coverImageUrl;
      if (!imageUrl) {
          return res.status(400).json({ error: 'User does not have a cover image' });
      }

      // Delete image from Cloudinary
      await deleteFromCloudinary(imageUrl);

      // Update user document in MongoDB to remove cover image URL
      const updatedUser = await User.findByIdAndUpdate(userId, { coverImageUrl: '' }, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Cover image deleted successfully', user: updatedUser });
  } catch (error) {
      console.error('Error deleting cover image:', error);
      res.status(500).json({ error: 'Server error. Failed to delete cover image' });
  }
};



exports.uploadProfileImage = async (req, res) => {
  const userId = req.params.userId;
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).json({ error: 'Missing userId or profileImage file' });
  }

  try {
    const imageUrl = await uploadOnCloudinary(file.path);
    console.log('Cloudinary Image URL:', imageUrl);

    const updatedUser = await User.findByIdAndUpdate(userId, { imageUrl }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile image uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Server error. Failed to upload profile image' });
  }
};

exports.deleteProfileImage = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const imageUrl = user.imageUrl;
    if (!imageUrl || imageUrl.includes('ui-avatars.com')) {
      return res.status(400).json({ error: 'User does not have a custom profile image' });
    }

    await deleteFromCloudinary(imageUrl);

    user.imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username[0].toUpperCase())}&background=random&color=fff&length=1`;
    await user.save();

    res.status(200).json({ message: 'Profile image deleted successfully', user });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({ error: 'Server error. Failed to delete profile image' });
  }
};