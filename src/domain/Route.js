class Route {
    constructor(origin, cost = 0, destinations = []) {
        this.origin = origin;
        this.cost = cost;
        this.destinations = destinations;
    }

    next = (routes) => {
        this.destinations = this.destinations.map(r => {
            let obj = Object.assign({}, routes[r.origin]);

            obj.cost = r.cost;
            return obj;
        });
        return this;
    }
}

module.exports = Route;