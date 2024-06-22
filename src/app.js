/**
* Curve Royalty Systems Take Home Exercise
*
* Point of entry for the script.
*
* @link   https://github.com/frashealey/curve_task
* @file   This files acts as the point of entry for the script.
* @author Fraser Healey.
*/

const mongoose = require("mongoose");
const xlsx = require("xlsx");
const { Track, Contract } = require("./models/models")

/**
* Opens Excel file, splits Aliases by semicolon, and returns array of objects.
* @param  {String}     filename    Excel file to parse
* @return {Array}                  Parsed tracks data as Array
*/
function parseImport(filename) {
    // Catches wrong filetype
    if (filename.split(".").pop() !== "xlsx") {
        return false;
    };

    // Opens and parses Excel file (removing first 'annotations' column)
    const excelFile = xlsx.readFile(filename);
    let excelParsed = xlsx.utils.sheet_to_json(excelFile["Sheets"][excelFile.SheetNames[0]]).slice(1);
    // Separates alises, by semicolon, for each track
    return excelParsed.map((i) => {
        i["Aliases"] = i["Aliases"].replace(/\s/g, "").split(";"); 
        return i;
    });
};

/**
* Main function for the script.
*/
function main() {
    console.log(Track);
    console.log(Contract);

    console.log(parseImport("task/Track Import Test.xlsx"));
};

if (require.main === module) {
    main();
};

// Export functions to be used for tests
module.exports = {
    parseImport
};
