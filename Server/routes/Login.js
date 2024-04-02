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
router.get('/auth/user/:userId', (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .lean()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = { ...user, password: undefined }; 
      res.json(userData);
    })
    .catch(err => {
      console.error("Error fetching user data:", err);
      res.status(500).json({ message: "Error fetching user data", error: err.message });
    });
});




router.put("/auth/user/update/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
  }

  const { name, email } = req.body;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update logic...
      if (name) user.username = name;
      if (email) user.email = email;

      await user.save();
      const updatedUserData = { ...user.toObject(), password: undefined };
      res.json({ message: "User updated successfully", user: updatedUserData });

  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user details", error: error.message });
  }
});




module.exports = router;
