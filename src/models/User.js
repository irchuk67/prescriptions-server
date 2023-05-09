const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    clinic: {
        type: String,
        required: true
    },
    clinicAddress: {
        type: String,
        required: true
    },
    specialisation: {
        type: String,
        required: false
    },
    assignedDoctors: {
        type: [String],
        required: false
    }
})

const User = module.exports = mongoose.model("User", userSchema);
