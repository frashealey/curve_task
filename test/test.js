const _ = require("lodash");
const assert = require("assert");
const app = require("../src/app");

describe("Excel", function() {
    describe("Non-Excel file", function() {
        it("returns false when no file", function() {
            assert.equal(app.parseImport(""), false);
        });
        it("returns false when incorrect filetype", function() {
            assert.equal(app.parseImport("task/Coding Test Details.docx"), false);
        });
    });

    describe("Valid file", function() {
        it("returns parsed data when valid filetype and format", function() {
            // Asserts that the value returned from parseImport matches
            // the desired output
            assert(
                _.isEqual(
                    app.parseImport("task/Track Import Test.xlsx"),
                    [
                        {
                            Title: "Track 1",
                            Version: "Version 1",
                            Artist: "Artist 1",
                            ISRC: "ISRC1",
                            "P Line": "P Line 1",
                            Aliases: [ "aliases1", "aliases2" ],
                            Contract: "Contract 1"
                        },
                        {
                            Title: "Track 2",
                            Version: "Version 2",
                            Artist: "Artist 2",
                            ISRC: "ISRC2",
                            "P Line": "P Line 2",
                            Aliases: [ "aliases11", "aliases22" ],
                            Contract: "Contract 2"
                        }
                    ]
                )
            );
        });
    });
});
