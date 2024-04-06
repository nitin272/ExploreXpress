require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("./Models/Login"); 
const app = express();
const secretKey = "Nitin"; 
app.use(express.json());
app.use(cors());


const Login = require("./routes/Login")
const google = require("./routes/Google")
const Hotel = require("./routes/Hotel")
const Restaurant = require('./routes/Restaurent')
const Places = require('./routes/Places')




  app.use(Places)
  app.use(Restaurant)
  app.use(Login);

  app.use(Hotel)

const URI = process.env.Mongo_Url;

mongoose.connect(URI, { dbName: "Exploreexpress" })
  .then(() => console.log("Connection successful"))
  .catch(err => console.error(err.message));



app.listen(4000, () => console.log("Server is running on port 4000"));

