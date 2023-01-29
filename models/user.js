const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    name: { type: String },
    bio: { type: String },
    bench: { type: Number },
    squat: { type: Number },
    deadlift: { type: Number }
});

const User = mongoose.model("User", userSchema);
module.exports = User;