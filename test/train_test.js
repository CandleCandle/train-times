
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, Journey, StationStop, JourneyFinder } from '../src/index.js';


const make_train = function(prov, train_id, times) {
    return new Train(prov, train_id, times.map(e => new StationStop(e[0], e[1])));
}

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
        it("truncates the train", function() {
            assert.deepStrictEqual(train.truncate_journey("STA", "END"), train);
        });
        it("identifies departure times", function() {
            assert.deepStrictEqual(train.departure_time("STA"), 1430);
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
        it("truncates the train", function() {
            assert.deepStrictEqual(train.truncate_journey("STA", "MID"), new Train(
                "PRV",
                1,
                [
                    new StationStop("STA", 1430),
                    new StationStop("MID", 1445),
                ]
            ));
        });
        it("truncation should include intermediate stations", function() {
            assert.deepStrictEqual(train.truncate_journey("STA", "END"), new Train(
                "PRV",
                1,
                [
                    new StationStop("STA", 1430),
                    new StationStop("MID", 1445),
                    new StationStop("END", 1500),
                ]
            ));
        });
        it("expansion should show all possible destinations", function() {
            assert.deepStrictEqual(train.all_destinations_from("STA"), [
                make_train("PRV", 1, [
                    ["STA", 1430],
                    ["MID", 1445]]),
                make_train("PRV", 1, [
                    ["STA", 1430],
                    ["MID", 1445],
                    ["END", 1500]])
            ]);
        });
        it("identifies departure times", function() {
            assert.deepStrictEqual(train.departure_time("STA"), 1430);
            assert.deepStrictEqual(train.departure_time("MID"), 1445);
        });
    });
});
