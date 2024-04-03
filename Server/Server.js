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
const Login = require('./routes/route')
const route = require('./routes/Login')
// const auth = require("./routes/auth")
const google = require("./routes/Google")
require("dotenv").config();


app.use(google);
app.use(route);
  app.use(Login);
  // app.use(auth);

const URI = process.env.Mongo_Url;

mongoose.connect(URI, { dbName: "Exploreexpress" })
  .then(() => console.log("Connaection successful"))
  .catch(err => console.error(err.message));



app.listen(5000, () => console.log("Server is running on port 5000"));

