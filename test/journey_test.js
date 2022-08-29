
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
});
