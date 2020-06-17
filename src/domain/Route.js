/**
 * Representa cada rota
 */
class Route {
    /**
     * @constructor
     * @param {string} origin - Origem da rota.
     * @param {string} destination - Destino da roda.
     * @param {int} cost - Custo da rota.
     */
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