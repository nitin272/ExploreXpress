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





app.use(route);
  app.use(Login);
  // app.use(auth);

const URI = 'mongodb+srv://nitinsoni:Nitin@cluster0.nsd72yp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URI, { dbName: "Exploreexpress" })
  .then(() => console.log("Connaection successful"))
  .catch(err => console.error(err.message));



app.listen(4000, () => console.log("Server is running on port 4000"));

