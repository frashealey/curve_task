const mongoose = require("mongoose");
const trackSchema = require("./trackSchema");
const contractSchema = require("./contractSchema");

module.exports = {
    Track: mongoose.model("tracks", trackSchema),
    Contract: mongoose.model("contracts", contractSchema)
};
