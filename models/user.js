const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    name: { type: String },
    location: {type: String},
    bio: { type: String },
    bench: { type: Number },
    squat: { type: Number },
    deadlift: { type: Number },
    profileImage: { type: String, default: "default-avatar.jpg" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;