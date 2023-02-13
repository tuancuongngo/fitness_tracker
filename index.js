// express
const express = require("express");
const app = express();
const path = require("path");
const Workout = require("./models/workout"); // import workout schema
const Exercise = require("./models/exercise");
const User = require("./models/user")

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

// multer for image upload
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'profile_images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // Middleware for communication to backend
app.use(methodOverride("_method")); // To edit data/workout in the DB. (Need npm install method-override)
app.use(express.static("public"));

// Route to retrieve workout
app.get("/", async (req, res) => {
    const workouts = await Workout.find({}); // Retrieve workout model and get all workouts
    workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    //console.log(workouts);
    res.render("home", { workouts });
});

// Route to display workout page
app.get("/pr-feed", async (req, res) => {
    const workouts = await Workout.find({}); // Retrieve workout model and get all workouts
    workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    //console.log(workouts);
    res.render("pr-feed", { workouts });
});


// Signin page
app.get("/signin", async (req, res) => {
    res.render("signin", { message: ""});
});

app.post("/signin", async (req, res) => {
    const email = req.body.email;
    const pw = req.body.password;
    User.findOne({ email: email }, function(err, foundUser) {
        if (err) {
            console.log(err);
        }
        else if (foundUser && foundUser.password === pw) {
            res.redirect(`user/${foundUser._id}`);
        }
        else {
            console.log("Incorrect Email or Password!");
            res.render("signin", { message: "Incorrect Email or Password! Try Again!" });
        }
    });
});

// Sign up page
app.get("/signup", async (req, res) => {
    res.render("signup");
});

app.post("/signup", async(req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect(`user/${newUser._id}`);
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

// Community page
app.get("/community", async (req, res) => {
    const users = await User.find({});
    res.render("community", { users });
});

// Details page of an user
app.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("profile", { user });
});

// get request to change profile/avatar page
app.get("/user/:id/upload-avatar", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("upload-avatar", { user });
});

// POST request to user DB to add new profile image
app.post("/avatar-upload", upload.single("new-avatar"), async (req, res) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const userId = req.body.userId;
    const user = await User.findById(userId);
    user.profileImage = req.file.path;
    await user.save();
    res.redirect(`/user/${user._id}`);
});

// Delete a user
app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    const deleteWorkout = await User.findByIdAndDelete(id);
    res.redirect("/community");
});

// Open port 3200
app.listen(3200, () => {
    console.log("Port 3200 active");
});




// const names = ["John", "Jane", "Jim", "Jessica", "Jack", "Jill", "Julie", "Josh", "Jordan", "Jasmine"];
// const bios = [
//     "Loves to lift heavy weights.",
//     "Has a passion for powerlifting.",
//     "Believes in the mind-muscle connection.",
//     "Enjoys pushing the limits in the gym.",
//     "Focuses on proper form in each exercise.",
//     "Believes in the power of progressive overload.",
//     "Has a goal to set personal records in every lift.",
//     "Loves the feeling of a good pump.",
//     "Takes recovery as seriously as the workout.",
//     "Enjoys trying new workout routines."
// ];

// for (let i = 0; i < names.length; i++) {
//         const user = new User({
//             username: names[i] + "_" + i,
//             name: names[i],
//             location: "city, state",
//             bio: bios[i],
//             bench: Math.floor(Math.random() * 300),
//             squat: Math.floor(Math.random() * 400),
//             deadlift: Math.floor(Math.random() * 500)
// });

// user.save();

// }


