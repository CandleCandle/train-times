
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, Journey, StationStop, JourneyFinder } from '../src/index.js';

const trains = [new Train(
    "PRV",
    0,
    [
        new StationStop("STA", 1430),
        new StationStop("END", 1500),
    ]
)];

describe('Path Tests', function() {
    it("finds a simple path", function() {
        let finder = new JourneyFinder(trains);
        let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
        assert.strictEqual(journey.trains().length, 1);
        assert.strictEqual(journey.changes(), 0);
        assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
        assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
    });
});
