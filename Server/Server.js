require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("./Modals/Login"); 
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



const allowedOrigins = [
  'http://localhost:4500', "https://explorexpress-n2ek.onrender.com",
  // other allowed origins can be added here
];

const corsOptions = {


  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes


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


mongoose.connect(URI, { dbName: "Exploreexpress" })
  .then(() => console.log("Connection successful"))


app.listen(4000, () => console.log("Server is running on port 4000"));



