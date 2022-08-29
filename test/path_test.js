
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, Journey, StationStop, JourneyFinder } from '../src/index.js';

const trains = [new Train(
    "PRV",
    [
        new StationStop("STA", 1430),
        new StationStop("END", 1500),
    ]
)];

describe('Path Tests', function() {
    it("finds a simple path", function() {
        let finder = new JourneyFinder(trains);
        let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
        assert.strictEqual(1, journey.trains().length);
        assert.strictEqual(0, journey.changes());
        assert.strictEqual(new StationStop("STA", 1430), journey.start());
        assert.strictEqual(new StationStop("END", 1500), journey.finish());
    });
});
