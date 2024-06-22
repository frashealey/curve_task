const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
    "Title": { type: String, required: true },
    "Version": String,
    "Artist": String,
    "ISRC": { type: String, required: true },
    "P Line": String,
    "Aliases": [String],
    "Contract ID": { type: mongoose.Schema.Types.ObjectId, ref: "contracts" }
});

module.exports = trackSchema;
