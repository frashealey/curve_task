const _ = require("lodash");
const assert = require("assert");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("../src/app");
const { Track, Contract } = require("../src/models/models");
dotenv.config();

describe("Excel tests", function() {
    it("returns false when no file", function() {
        assert.equal(app.parseImport(""), false);
    });
    it("returns false when incorrect filetype", function() {
        assert.equal(app.parseImport("task/Coding Test Details.docx"), false);
    });
    it("returns parsed data when valid filetype and format", function() {
        assert(
            _.isEqual(
                app.parseImport("task/Track Import Test.xlsx"),
                [
                    {
                        "Title": "Track 1",
                        "Version": "Version 1",
                        "Artist": "Artist 1",
                        "ISRC": "ISRC1",
                        "P Line": "P Line 1",
                        "Aliases": [ "aliases1", "aliases2" ],
                        "Contract": "Contract 1"
                    },
                    {
                        "Title": "Track 2",
                        "Version": "Version 2",
                        "Artist": "Artist 2",
                        "ISRC": "ISRC2",
                        "P Line": "P Line 2",
                        "Aliases": [ "aliases11", "aliases22" ],
                        "Contract": "Contract 2"
                    }
                ]
            )
        );
    });
});

describe("Ingest tests", function() {
    before(function() {
        return mongoose.connect(process.env.DB_HOST);
    });
    beforeEach(function() {
        return Contract.create({ "Name": "testContractMatch" });
    });
    afterEach(function() {
        return mongoose.connection.dropDatabase();
    });
    after(function() {
        return mongoose.disconnect();
    });

    it("ingests track when no contract field", async function() {
        const ingestError = await app.ingestTrack(
            {
                "Title": "testTrack",
                "Version": "testVersion",
                "Artist": "testArtist",
                "ISRC": "ISRCtest",
                "P Line": "testPLine",
                "Aliases": [ "testAlias" ],
            }
        );
        const queryTrack = await Track.findOne();
        assert(ingestError === undefined && queryTrack !== null);
    });
    it("returns error when contract field, contract does not exist", async function() {
        const ingestError = await app.ingestTrack(
            {
                "Title": "testTrack",
                "Version": "testVersion",
                "Artist": "testArtist",
                "ISRC": "ISRCtest",
                "P Line": "testPLine",
                "Aliases": [ "testAlias" ],
                "Contract": "testContract"
            }
        );
        const queryTrack = await Track.findOne();
        assert(ingestError === "testContract is not found" && queryTrack === null);
    });
    it("ingests track when contract field, contract exists", async function() {
        const ingestError = await app.ingestTrack(
            {
                "Title": "testTrack",
                "Version": "testVersion",
                "Artist": "testArtist",
                "ISRC": "ISRCtest",
                "P Line": "testPLine",
                "Aliases": [ "testAlias" ],
                "Contract": "testContractMatch"
            }
        );
        const queryTrack = await Track.findOne();
        assert(ingestError === undefined && queryTrack !== null);
    });
});

describe("System test", function() {
    it("ingests Track 1 and errors Track 2", async function() {
        // Runs main function
        const ingestErrorArr = await app.main();

        // Verifies that only "Track 1" has been added
        await mongoose.connect(process.env.DB_HOST);
        const queryTrack = await Track.find();
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();

        assert(
            _.isEqual(
                ingestErrorArr,
                [ { Line: 1, Error: 'Contract 2 is not found' } ]
            )
            &&
            ( queryTrack.length === 1 && queryTrack[0]["Title"] === "Track 1" )
        );
    });
});
