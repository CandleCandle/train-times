
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, Journey, StationStop, JourneyFinder } from '../src/index.js';



describe('Train Tests', function() {
    describe('Simple two-station train', function() {
        const train = new Train(
            "PRV",
            1,
            [
                new StationStop("STA", 1430),
                new StationStop("END", 1500),
            ]
        );
        it("finds the start station", function() {
            assert.deepStrictEqual(train.start(), new StationStop("STA", 1430));
        });
        it("finds the finish station", function() {
            assert.deepStrictEqual(train.finish(), new StationStop("END", 1500));
        });
        it("identifies the train provider", function() {
            assert.strictEqual("PRV", train.provider());
        });
        it("calculates the station stops", function() {
            assert.deepStrictEqual(train.stops_at(), ["STA", "END"]);
        });
    });
    describe('Simple three-station train', function() {
        const train = new Train(
            "PRV",
            1,
            [
                new StationStop("STA", 1430),
                new StationStop("MID", 1445),
                new StationStop("END", 1500),
            ]
        );
        it("finds the start station", function() {
            assert.deepStrictEqual(train.start(), new StationStop("STA", 1430));
        });
        it("finds the finish station", function() {
            assert.deepStrictEqual(train.finish(), new StationStop("END", 1500));
        });
        it("identifies the train provider", function() {
            assert.strictEqual(train.provider(), "PRV");
        });
        it("calculates the station stops", function() {
            assert.deepStrictEqual(train.stops_at(), ["STA", "MID", "END"]);
        });
    });

});
