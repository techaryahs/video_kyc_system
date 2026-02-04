const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    transcript: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", UserSchema);
