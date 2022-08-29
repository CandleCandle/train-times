
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, Journey, StationStop, JourneyFinder } from '../src/index.js';

let train_id = 0;

const make_train = function(prov, times) {
    train_id = train_id + 1;
    return new Train(prov, train_id, times.map(e => new StationStop(e[0], e[1])));
}

describe('Path Tests', function() {
    describe('Simple network', function() {
        const trains = [make_train("PRV", [["STA", 1430], ["END", 1500]])];
        it("finds a simple path", function() {
            let finder = new JourneyFinder(trains);
            let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
            assert.strictEqual(journey.trains().length, 1);
            assert.strictEqual(journey.changes(), 0);
            assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
            assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
        });
    });
    describe('Simple two train network, changes.', function() {
        const trains = [
            make_train("PRV", [["STA", 1430], ["END", 1440]]),
            make_train("PRV", [["STA", 1450], ["END", 1500]]),
        ];
        it("finds a simple path", function() {
            let finder = new JourneyFinder(trains);
            let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
            assert.strictEqual(journey.trains().length, 2);
            assert.strictEqual(journey.changes(), 1);
            assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
            assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
        });
    });
    describe('Simple two train network', function() {
        const trains = [
            make_train("PRV", [["STA", 1000], ["END", 1100]]),
            make_train("PRV", [["STA", 1430], ["END", 1500]]),
        ];
        it("filters trains that are too early", function() {
            let finder = new JourneyFinder(trains);
            let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
            assert.strictEqual(journey.trains().length, 1);
            assert.strictEqual(journey.changes(), 0);
            assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
            assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
        });
    });
    describe('Simple route', function() {
        const trains = [
            make_train("PRV", [["STA", 1000], ["MID", 1100]]),
            make_train("PRV", [["MID", 1130], ["END", 1500]]),
            make_train("PRV", [["STA", 1430], ["MID", 1440]]),
            make_train("PRV", [["MID", 1450], ["END", 1500]]),
        ];
        it("finds the only timely route", function() {
            let finder = new JourneyFinder(trains);
            let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
            assert.strictEqual(journey.trains().length, 1);
            assert.strictEqual(journey.changes(), 0);
            assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
            assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
        });
    });
    describe('Simple direct with optional changes', function() {
        const trains = [
            make_train("PRV", [["STA", 1430], ["MID", 1440]]),
            make_train("PRV", [["MID", 1450], ["END", 1500]]),
            make_train("PRV", [["STA", 1430], ["END", 1500]]),
        ];
        it("finds the route with the fewest changes", function() {
            let finder = new JourneyFinder(trains);
            let journey = finder.find_journey("STA", "END", "1970-02-02T14:00+00:00");
            assert.strictEqual(journey.trains().length, 1);
            assert.strictEqual(journey.changes(), 0);
            assert.deepStrictEqual(journey.start(), new StationStop("STA", 1430));
            assert.deepStrictEqual(journey.finish(), new StationStop("END", 1500));
        });
    });
});
