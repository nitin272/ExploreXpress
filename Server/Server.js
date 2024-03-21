const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("./Models/Login"); 
const app = express();
const secretKey = "Nitin"; 
const Model  = require('./Models/Model');
app.use(express.json());
app.use(cors());

const URI = 'mongodb+srv://nitinsoni:Nitin@cluster0.nsd72yp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URI, { dbName: "Exploreexpress" })
  .then(() => console.log("Connaection successful"))


  
  .catch(err => console.error(err.message));

app.listen(10000, () => console.log("Server is running on port 4000"));

app.post("/api/auth/signup", async (req, res) => {
  try {

    
    const { name, email, password } = req.body;
    const newUser = await User.create({ 
      username: name, 
      email, 
      password: await bcrypt.hash(password, 10) // Ensure to hash password before saving
    });
    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

app.get("/", (req, res) => {
  Model.find({})
    .lean()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    });
});
