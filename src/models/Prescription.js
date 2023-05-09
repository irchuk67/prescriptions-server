const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true
    }
})

const Prescription = module.exports = mongoose.model("Prescription", prescriptionSchema);
