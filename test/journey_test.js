
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, Journey, StationStop, JourneyFinder } from '../src/index.js';



describe('Journey Tests', function() {
    describe('Simple two-station journey', function() {
        const journey = new Journey([new Train(
            "PRV",
            1,
            [
                new StationStop("STA", 1430),
                new StationStop("END", 1500),
            ]
        )]);
        describe('basic setup', function() {
            it("finds the journey start station", function() {
                assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
            });
            it("finds the journey finish station", function() {
                assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
            });
            it("finds the number of changes required", function() {
                assert.strictEqual(0, journey.changes());
            });
        });
        describe('adds a trip', function() {
            let result = journey.with_train(new Train(
                "PRV",
                2,
                [
                    new StationStop("END", 1501),
                    new StationStop("MRE", 1530),
                ]
            ))
            it("finds the journey start station", function() {
                assert.deepStrictEqual(result.start(), new StationStop("STA", 1430));
            });
            it("finds the journey finish station", function() {
                assert.deepStrictEqual(result.finish(), new StationStop("MRE", 1530));
            });
            it("finds the number of changes required", function() {
                assert.strictEqual(1, result.changes());
            });
        });
    });
});
