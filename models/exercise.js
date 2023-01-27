const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Export the schema
const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
