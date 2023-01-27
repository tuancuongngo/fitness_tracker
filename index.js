// express
const express = require("express");
const app = express();
const path = require("path");
const Workout = require("./models/workout"); // import workout schema
const Exercise = require("./models/exercise");

// mongoose
const mongoose = require("mongoose");
const port = process.env.PORT || 5000; // Backend port
const methodOverride = require("method-override");

// .env file for db connection
require("dotenv").config();

// db connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // Middleware for communication to backend
app.use(methodOverride("_method")); // To edit data/workout in the DB. (Need npm install method-override)
app.use(express.static("public"));

// Route to retrieve workout
app.get("/", async (req, res) => {
    const workouts = await Workout.find({}); // Retrieve workout model and get all workouts
    //console.log(workouts);
    res.render("home", { workouts });
});

// Details page of a workout
app.get("/workout/:id", async (req, res) => {
    const { id } = req.params;
    const workouts = await Workout.findById(id);
    res.render("detail", { workouts });
});

// New workout page
app.get("/new", (req, res) => {
    res.render("new");
});

// POST request to workout DB to add new workout
app.post("/workouts", async (req, res) => {
    //console.log(typeof req.body.date);
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.redirect(`workout/${newWorkout._id}`); // Redirect to workout detail page
});

// GET request to edit a workout
app.get("/workout/:id/edit", async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findById(id);
    res.render("edit", { workout });
});

// write the edited workout back to DB
app.put("/workout/:id", async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/workout/${workout._id}`);
});

// Delete a workout
app.delete("/workout/:id", async (req, res) => {
    const { id } = req.params;
    const deleteWorkout = await Workout.findByIdAndDelete(id);
    res.redirect("/");
});

// About page
app.get("/about", async (req, res) => {
    res.render("about");
});

// Open port 3200
app.listen(3200, () => {
    console.log("Port 3200 active");
});
