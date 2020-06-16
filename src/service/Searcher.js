let possibleRoutes;

/**
 * Responsável por realizar a busca de rotas
 */
class Searcher {
    /**
     * @constructor
     * @param {Route[]} allRoutes - array de rotas
     */
    constructor(allRoutes) {
        this.allRoutes = allRoutes;
    }

    /** 
     * Realiza a busca baseada na origem e destion
     * @param {origin} - origem a ser buscada
     * @param {destination} - destino a ser alcançado
     * @returns {string} string formatada com a rota mais barata
    */
    searchCheapestRouteFormatted(origin, destination) {
        possibleRoutes = [];
        this._calcPossibleRoutes(origin, destination);

        if (possibleRoutes.length == 0) throw new Error('no routes');

        let [bestRoute, bestRouteCost] = this._getCheapestRoute(possibleRoutes);
        return this._formatString(bestRoute, bestRouteCost);
    }

    /**
     * Responsável por calcular as possíveis rotas para uma dada origem e destino
     * 
     * @param {string} origin - origem a ser buscada
     * @param {string} destination - destino a ser alcançado
     * @param {Route[]} previousRoutes - rotas anteriores
     */
    _calcPossibleRoutes(origin, destination, previousRoutes = []) {
        this.allRoutes.forEach(route => {
            if (route.origin == origin) {
                previousRoutes.push(route);

                if (route.destination == destination) {
                    possibleRoutes.push(previousRoutes);
                    previousRoutes = [];
                    return;
                } else {
                    let newOrigin = route.destination;
                    this._calcPossibleRoutes(newOrigin, destination, previousRoutes);
                    previousRoutes = [];
                    return;
                }
            }
        });
    }

    /**
     * Responsável por encontrar a rota mais barata entre as possíveis rotas
     * @param {Route[]} routes - recebe o possibleRoutes
     * @returns {Array} array com a rota mais barata e seu respectivo custo
     */
    _getCheapestRoute(routes) {
        let bestRoute = routes[0];
        let bestRouteCost = bestRoute.map(inner => parseInt(inner.cost)).reduce((a, b) => a + b, 0);
        let actualRouteCost;

        routes.slice(1).forEach(route => {
            actualRouteCost = route.map(inner => parseInt(inner.cost)).reduce((a, b) => a + b, 0);

            if (actualRouteCost < bestRouteCost) {
                bestRoute = route;
                bestRouteCost = actualRouteCost;
            }
        })
        return [bestRoute, bestRouteCost];
    }

    /**
     * Formata o conjunto de rotas da forma como é solicitado
     * @param {string} routes - array com o melhor conjunto de rotas
     * @param {int} cost - custo desse conjunto
     */
    _formatString(routes, cost) {
        let i = 0;
        let routeStr = '';

        for (i; i < routes.length; i++) {
            routeStr += routes[i].origin + ' - ';
        }

        return 'best route: ' + routeStr + routes[i - 1].destination + ' > $' + cost;
    }
}

module.exports = Searcher;