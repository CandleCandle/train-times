
// graph vertex: Station.
// graph edge: partial Train.
//     start station (at time)
//     end station (at time)

// graph creation:
// A->B; B->C; C->D;

// graph walk: dijkstra:
//     edge selection: filter by trains departing after current weight
//     edge weight is duration of train journey.

// input: start station; departure time
// output: list of partial Trains

class Station {
    constructor(station_id, trains) {
        this._station_id = station_id;
        this._trains = trains;
    }
    departing_after(time) {
        return this._trains;
    }

}

class Journey {
    constructor(trains) {
        this._trains = trains;
    }

    static journey_start(start_station_id, start_time) {
        return {
            trains: () => [],
            changes: () => 0,
            start: () => new StationStop(start_station_id, start_time),
            finish: () => new StationStop(start_station_id, start_time)
        };
    }

    with_train(train) {
        return new Journey(this._trains.concat([train]));
    }

    trains() { return this._trains; }

    changes() { return this._trains.length - 1; }

    start() { return this._trains[0].start(); }

    finish() {
        return this._trains[this._trains.length-1].finish();
    }
}

class TrainSet {
    constructor(trains) {
        this._trains = trains;
    }

    destinations_from(station_stop, after_time) {
        // the first train to each possible destination, that departs after the desired time
        
        return this._trains
            .filter(t => {
                let r = t.stops_at().includes(station_stop);
                return r;
            }).flatMap(t => {
                return [t];
            });
    }
}

class JourneyFinder {
    constructor(trains) {
        this._trains = new TrainSet(trains);
    }
    find_journey(station_id_start, station_id_stop, date_time_start) {
        let fastest_journeys = {station_id_start: Journey.journey_start(station_id_start, date_time_start)};
        let to_visit = [station_id_start];
        while (to_visit.length > 0) {
            let current = to_visit.pop();
            let latest_time = fastest_journeys[current].finish().arrival();
            // find all suitable destinations from current.
            let next_steps = this._trains.destinations_from(current, latest_time)
            // make journeys from from current to destination
            // filter using fastest_journeys
            // update fastest journeys
            // add suitable destinations to to_visit.

        }

        return new Journey(this._trains);
    }

}

class StationStop {
    constructor(station_id, time) {
        this.station_id = station_id;
        this.time = time;
    }
    arrival() {
        return this.time-1;
    }
    departure() {
        return this.time;
    }
}

class Train {
    constructor(provider, id, timetable) {
        this._timetable = timetable;
        this.id = id;
        this._provider = provider;
    }

    provider() { return this._provider; }

    stops_at() {
        return Object.entries(this._timetable).map(e => e[1].station_id);
    }

    truncate_journey(start, stop) {
        const startIndex = this._timetable.findIndex(station => station.station_id === start);
        const endIndex = this._timetable.findIndex(station => station.station_id === stop);
        return new Train(
            this._provider,
            this.id,
            this._timetable.slice(startIndex, endIndex + 1)
        );
    }

    start() {
        return this._timetable[0];
    }

    finish() {
        return this._timetable[this._timetable.length-1];
    }

}

let tfl_pad_rgd = new Train(
    "TFL",
    [
        new StationStop("PAD", 2011),
        new StationStop("EBR", 2023),
        new StationStop("RGD", 2113),
    ]
);
let gwr_rgd_gtw = new Train(
    "GWR",
    [
        new StationStop("RGD", 2134),
        new StationStop("WOK", 2143),
        new StationStop("CRO", 2149),
    ]
);

export { Train, Station, TrainSet, Journey, StationStop, JourneyFinder };
