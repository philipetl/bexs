class Route {
    constructor(origin, cost, destinations = []) {
        this.origin = origin;
        this.cost = cost;
        this.destinations = destinations;
    }

    next = (routes) => {
        this.destinations = this.destinations.map(r => {
            r.destinations = routes[r.origin].destinations     
            return r;
        })
            .map(r => r.next(routes));

        return this;
    }
}

module.exports = Route;