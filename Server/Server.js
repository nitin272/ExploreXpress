
// const URI = 'mongodb+srv://nitinsoni:Nitin@cluster0.nsd72yp.mongodb.net/?retryWrites=true&w=majority';
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Model = require("./Model"); // Ensure this is the correct path to your model

const app = express();

app.use(express.json());
app.use(cors());

// Replace <username>, <password>, and <your-cluster-url> with your actual MongoDB Atlas connection details
const URI = 'mongodb+srv://nitinsoni:Nitin@cluster0.nsd72yp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URI, { dbName: "Exploreexpress" })
  .then(() => {
    console.log("Connection successful");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error(err.message);
  });

// Endpoint to get data
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
