const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Modals/Login');
const userdb = require("../Modals/Google");
const secretKey = "Nitin";


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
