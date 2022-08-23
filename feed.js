// Feed in test data to DB

// express
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Workout = require("./models/workout"); // import workout schema

const port = process.env.PORT || 5000; // Backend port

// .env file
require("dotenv").config();

// db connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.get("/workout", (req, res) => {
    res.send("Workouts will be here");
});

// First workout to be logged in backend server
const stuff = new Workout({
    name: "ngoct",
    exercise: "Bench Press",
    weight: 230,
    comment: "Need to go heavier next time",
    date: "2022-12-09",
});

stuff
    .save()
    .then((stuff) => {
        console.log(stuff);
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(5000, () => {
    console.log("Going on port");
});
