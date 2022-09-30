
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
            finish: () => new StationStop(start_station_id, start_time),
            with_train: (train) => new Journey([train])
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
                return t.stops_at().includes(station_stop);
            }).filter(t => {
                return t.departure_time(station_stop) >= after_time;
            }).flatMap(t => {
                return t.all_destinations_from(station_stop);
            });
    }
}

class JourneyFinder {
    constructor(trains) {
        this._trains = new TrainSet(trains);
    }
    find_journey(station_id_start, station_id_stop, date_time_start) {
        let fastest_journeys = {};
        fastest_journeys[station_id_start] = Journey.journey_start(station_id_start, date_time_start);
        let to_visit = [station_id_start];
        let visited = [];
        while (to_visit.length > 0) {
            let current = to_visit.pop();
            visited.push(current);
            let latest_time = fastest_journeys[current].finish().arrival();
            // find all suitable destinations from current.
            let next_steps = this._trains.destinations_from(current, latest_time)
            // make journeys from station_id_start to each next step.
            // filter using fastest_journeys
            // update fastest journeys
            // add suitable destinations to to_visit.
            let fastest_to_current = fastest_journeys[current];
            next_steps
                .map(step => {
                    return fastest_to_current.with_train(step); // journeys from start to next_steps
                }).forEach(journey => {
                    let journey_finish = journey.finish().station_id;
                    if (!visited.includes(journey_finish) && !to_visit.includes(journey_finish)) {
                        to_visit.push(journey_finish);
                    }
                    if (fastest_journeys[journey_finish]) {
                        // there exists a journey to this station
                        let current_fastest = fastest_journeys[journey_finish];
                        if (current_fastest.finish().arrival() > journey.finish().arrival()) {
                            fastest_journeys[journey_finish] = journey;
                        }
                    } else {
                        fastest_journeys[journey_finish] = journey;
                    }
                });
        }

        return fastest_journeys[station_id_stop];
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

    all_destinations_from(start) {
        let found = false;
        let routes = [];
        for (let i = 0; i < this._timetable.length; ++i) {
            let current = this._timetable[i];
            if (found) {
                routes.push(this.truncate_journey(start, current.station_id));
            }
            if (current.station_id === start) found = true;
        }
        return routes;
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

    departure_time(station_id) {
        return this._timetable
            .find(station_stop => station_stop.station_id == station_id)
            .departure()
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
