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
    constructor(origin, destination, cost) {
        this.origin = origin;
        this.destination = destination;
        this.cost = cost;
    }
}

module.exports = Route;