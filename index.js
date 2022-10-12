// express
const express = require("express");
const app = express();
const path = require("path");
const Workout = require("./models/workout"); // import workout schema
const Title = require("./models/title"); // import title schema*******************************************

// mongoose
const mongoose = require("mongoose");
const port = process.env.PORT || 5000; // Backend port
const methodOverride = require("method-override");
const { title } = require("process");

// .env file
require("dotenv").config();

// ****************************************************
// mongoose.connect(  
//     process.env.ATLAS_URI || 'mongodb://localhost:27017/todolistDB',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     },
// );
// ****************************************************


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
    console.log(workouts);
    res.render("home", { workouts });
});

// Details page of a workout
app.get("/workout/:id", async (req, res) => {
    const { id } = req.params;
    const workouts = await Workout.findById(id);
    res.render("detail", { workouts });
});

// New workout page
app.get("/new", async (req, res) => {
    res.render("new");
});

// POST request to workout DB to add new workout
app.post("/workouts", async (req, res) => {
    //console.log(typeof req.body.date);
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    await Title.findOneAndUpdate( {name: newWorkout.name}, { $push: { exercises: newWorkout } }, { upsert: true, new: true });
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
    const workout = await Workout.findById(id);
    await Workout.findByIdAndDelete(id);
    await Title.findOneAndUpdate({ name: workout.name }, { $pull: { exercises: { _id: id } } }, { runValidators: true });
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
