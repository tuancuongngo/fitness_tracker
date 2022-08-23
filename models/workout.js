const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exercise: { type: String, required: true },
    weight: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
});

// Export the schema
const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
