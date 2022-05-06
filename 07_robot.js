"use strict";

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;

        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return { place: destination, address: p.address };
            }).filter(p => p.place != p.address);

            return new VillageState(destination, parcels);
        }
    }
};

VillageState.random = function (parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({ place, address });
    }

    return new VillageState("Post Office", parcels);
};
/**
 * 
 * @param {VillageState} state 
 * @param {Function} robot (state, memory)->{direction, memory}
 * @param {Array} memory 
 * @returns 
 */
function runRobot(state, robot, memory) {
    for (let turn = 0; ; turn++) {
        if (state.parcels.length == 0) {
            // console.log(`Done in ${turn} turns`);
            // break;
            return turn;
        }

        let action = robot(state, memory);

        state = state.move(action.direction);

        memory = action.memory;

        // console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
}

function findRoute(graph, from, to) {
    let work = [{ at: from, route: [] }];

    for (let i = 0; i < work.length; i++) {
        let { at, route } = work[i];

        for (let place of graph[at]) {
            if (place == to) return route.concat(place);

            if (!work.some(w => w.at == place)) {
                work.push({ at: place, route: route.concat(place) });
            }
        }
    }
}

function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let parcel = parcels[0];

        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }

    return { direction: route[0], memory: route.slice(1) };
}

function goalOrientedRobotEfficient({ place, parcels }, route) {
    if (route.length == 0) {
        // get parcels that are at the current place, then find routes to deliver
        let route_to_deliver = parcels.filter((parcel) => {
            return parcel.place === place;
        }).map((parcel) => {
            return findRoute(roadGraph, place, parcel.address);
        }).reduce((prev, cur) => {
            // find min
            if (prev > cur || prev.length === 0) {
                return cur;
            }

            return prev;
        }, []);

        let route_to_pick_up = parcels.filter((parcel) => {
            return parcel.place !== place;
        }).map((parcel) => {
            return findRoute(roadGraph, place, parcel.place);
        }).reduce((prev, cur) => {
            // find min
            if (prev > cur || prev.length === 0) {
                return cur;
            }

            return prev;
        }, []);

        // ERROR: route to deliver is empty here
        route = route_to_pick_up <= route_to_deliver ? route_to_pick_up : route_to_deliver;
    }

    return { direction: route[0], memory: route.slice(1) };
}

function compareRobots(robot1, memory1, robot2, memory2) {
    let first_robot_average = 0;

    let second_robot_average = 0;

    for (let i = 0; i < 100; i++) {
        const state = VillageState.random();

        first_robot_average += runRobot(state, robot1, memory1) / 100;
        second_robot_average += runRobot(state, robot2, memory2) / 100;
    }

    return [first_robot_average, second_robot_average];
}

const [goal_oriented, mail_route_oriented] = compareRobots(goalOrientedRobot, [], goalOrientedRobotEfficient, []);

console.log(goal_oriented, mail_route_oriented);