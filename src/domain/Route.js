/**
 * Representa cada rota e seus destinos possíveis
 */
class Route {
    /**
     * @constructor
     * @param {string} origin - Origem da rota
     * @param {int} cost - Custo da rota em relação ao elemento pai
     * @param {Route[]} destinations - Array de destinos possíveis
     */
    constructor(origin, cost, destinations = []) {
        this.origin = origin;
        this.cost = cost;
        this.destinations = destinations;
    }

    /**
     * Responsável por preencher os dados de todas os possíveis camihos para uma dada roda
     * @param {Route[]} routes - Array com todas as rotas
     * @returns Devolve todos os caminhos possíveis a partir de uma origem
     */
    next(routes) {
        this.destinations = this.destinations.map(r => {
            r.destinations = routes[r.origin].destinations
            return r;
        })
            .map(r => r.next(routes));

        return this;
    }
}

module.exports = Route;