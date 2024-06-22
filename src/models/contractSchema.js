const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    "Name": { type: String, required: true }
});

module.exports = contractSchema;
