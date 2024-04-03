const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/Login");
const cors = require("cors");

const router = express.Router();
const secretKey = "Nitin";

router.use(cors());

router.post("/auth/signup", async (req, res) => {
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
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.json({ message: "Login successful", token, userId: user._id }); 
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude the password field
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password'); // Excludes the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Assuming the username field stores the name, adjust the response accordingly
    res.json({name: user.username, ...user.toObject()});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});



module.exports = router;
