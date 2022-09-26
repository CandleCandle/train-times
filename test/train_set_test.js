
import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Train, Station, TrainSet, StationStop, JourneyFinder } from '../src/index.js';

const make_train = function(prov, train_id, times) {
    return new Train(prov, train_id, times.map(e => new StationStop(e[0], e[1])));
}

describe('Train Set Tests', function() {
    describe('finds next departing trains', function() {
        it("finds when there is one possible destination", function() {
            const trainset = new TrainSet([
                make_train("PRV", 1, [["STA", 1430], ["END", 1500]])
            ]);
            assert.deepStrictEqual(trainset.destinations_from("STA", 1429), [make_train("PRV", 1, [["STA", 1430], ["END", 1500]])]);
        });
        it("finds when there are two possible destination", function() {
            const trainset = new TrainSet([
                make_train("PRV", 1, [
                    ["STA", 1430],
                    ["MID", 1500],
                    ["END", 1530]])
            ]);
            assert.deepStrictEqual(trainset.destinations_from("STA", 1429), [
                make_train("PRV", 1, [["STA", 1430], ["MID", 1500]]),
                make_train("PRV", 1, [["STA", 1430], ["END", 1530]])
            ]);
        });
        it("unsuitable trains are not included", function() {
            const trainset = new TrainSet([
                make_train("PRV", 2, [
                    ["NOT", 1430],
                    ["END", 1530]]),
                make_train("PRV", 1, [
                    ["STA", 1430],
                    ["END", 1530]])
            ]);
            assert.deepStrictEqual(trainset.destinations_from("STA", 1429), [
                make_train("PRV", 1, [["STA", 1430], ["END", 1530]])
            ]);
        });
    });
});
