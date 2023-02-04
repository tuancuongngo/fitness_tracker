const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String},
    password: { type: String, default: "123pw"},
    username: { type: String, required: true},
    name: { type: String },
    location: {type: String, default: "Fighting demons in some nearby Gym"},
    bio: { type: String, default: "New User" },
    bench: { type: Number, default: 0 },
    squat: { type: Number, default: 0 },
    deadlift: { type: Number, default: 0 },
    profileImage: { type: String, default: "default-avatar.jpg" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;