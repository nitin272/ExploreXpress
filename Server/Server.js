require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("./Models/Login"); 
const session = require('express-session');
const app = express();
const secretKey = "Nitin"; 
const path = require('path');






app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
}));



app.use(express.json());
const corsOptions = {
  origin: ['http://explorexpress-n2ek.onrender.com', 'http://localhost:4500'], 
  credentials: true, // This is important for cookies/token and basic auth
};

app.use(cors(corsOptions));

const Login = require("./routes/Login")
const google = require("./routes/Google")
const Hotel = require("./routes/Hotel")
const Restaurant = require('./routes/Restaurent')
const Places = require('./routes/Places')




  app.use(google)
  app.use(Places)
  app.use(Restaurant)
  app.use(Login);
  app.use(Hotel)

const URI = process.env.MONGODB_URI;

mongoose.connect("mongodb+srv://nitinsoni:Nitin@cluster0.nsd72yp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: "Shop" })
  .then(() => console.log("Connection successful"))


app.listen(4000, () => console.log("Server is running on port 4000"));


