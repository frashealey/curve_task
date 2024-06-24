/**
* Curve Royalty Systems Take Home Exercise
*
* Point of entry for the script.
*
* @link   https://github.com/frashealey/curve_task
* @file   This files acts as the point of entry for the script.
* @author Fraser Healey.
*/

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const { Track, Contract } = require("./models/models");
dotenv.config();

/**
* Opens Excel file, splits Aliases by semicolon, and returns array of objects.
* @param {String} filename - Excel file to parse.
* @return {Array} Parsed tracks data as Array.
*/
function parseImport(filename) {
    // Catches wrong filetype
    if (filename.split(".").pop() !== "xlsx") {
        return false;
    };

    // Opens and parses Excel file (removing first annotations column)
    const excelFile = xlsx.readFile(filename);
    let excelParsed = xlsx.utils.sheet_to_json(excelFile["Sheets"][excelFile.SheetNames[0]]).slice(1);
    // Separates aliases by semicolon for each track
    return excelParsed.map((i) => {
        i["Aliases"] = i["Aliases"].replace(/\s/g, "").split(";"); 
        return i;
    });
};

/**
* Starts a transaction, checks if "Contract" exists (if provided),
* ingests track if it does (or no "Contract" is provided),
* and returns error if it does not.
* @param  {Object} track - Track object to be ingested.
* @return {Promise<String>} Error string if track cannot be ingested.
*/
async function ingestTrack(track) {
    let ingestError;
    let session = await mongoose.startSession();

    try {
        // Starts transaction, executes, and commits (or aborts on error)
        ingestError = await session.withTransaction(async () => {
            // Contract name exists in input track
            if ("Contract" in track) {
                // Finds matching contract name, and returns
                // error if it does not exist in database
                let queryContract = await Contract.findOne(
                    { "Name": track["Contract"] }
                ).session(session);
                if (queryContract === null) {
                    return `${track["Contract"]} is not found`;
                };

                // Remove contract field and add contract ID field
                // (if contract exists in database)
                delete track["Contract"];
                track["Contract ID"] = queryContract["_id"];
            }

            // Creates Track document
            await Track.create([ track ], { session });
        });
    }
    finally {
        await session.endSession();
    };

    return ingestError;
};

/**
* Main function for the script.
* @return {Promise<Array>} Array of errored tracks.
*/
async function main() {
    // Opens and parses the spreadsheet
    const data = parseImport("task/Track Import Test.xlsx");
    if (data === false) {
        return;
    };

    // Connects to local database
    await mongoose.connect(process.env.DB_HOST);

    // Creates Contract 1
    await Contract.create({ "Name": "Contract 1" });

    // Ingests or pushes error for each track
    let ingestErrorArr = [];
    for (let i = 0, n = data.length; i < n; i++) {
        const ingestError = await ingestTrack(data[i]);
        // Pushes error if one is produced
        if (ingestError) {
            ingestErrorArr.push({ "Line": i, "Error": ingestError });
        };
    };
    // Logs errors to console
    console.table(ingestErrorArr);

    // Disconnects from database when finished
    await mongoose.disconnect();
    return ingestErrorArr;
};

if (require.main === module) {
    main();
};

module.exports = {
    parseImport,
    ingestTrack,
    main
};
