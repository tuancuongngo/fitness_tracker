const mongoose = require("mongoose");
const Workout = require("./workout"); // import workout schema

const titleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exercises: [Workout.schema]
});

const Title = mongoose.model("Title", titleSchema);

module.exports = Title;
