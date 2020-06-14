class Searcher {
    constructor(allRoutes) {
        this.allRoutes = allRoutes;
        this.possibleRoutes = [];
    }

    searchCheapestRouteFormatted = (origin, destination) => {
        this._calcPossibleRoutes(origin, destination);

        if (this.possibleRoutes.length == 0) throw new Error('no routes');

        let [bestRoute, bestRouteCost] = this._getCheapestRoute(this.possibleRoutes);
        return this._formatString(bestRoute, bestRouteCost);
    }

    _calcPossibleRoutes = (origin, destination, previousRoutes = []) => {
        this.allRoutes.forEach(route => {
            if (route.origin == origin) {
                previousRoutes.push(route);

                if (route.destination == destination) {
                    this.possibleRoutes.push(previousRoutes);
                    previousRoutes = [];
                    return;
                } else {
                    let newOrigin = route.destination
                    this._calcPossibleRoutes(newOrigin, destination, previousRoutes)
                    previousRoutes = [];
                    return;
                }
            }
        });
    }

    _getCheapestRoute = (routes) => {
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

    _formatString = (route, cost) => {
        let i = 0;
        let routeStr = '';

        for (i; i < route.length; i++) {
            routeStr += route[i].origin + ' - ';
        }

        return 'best route: ' + routeStr + route[i - 1].destination + ' > $' + cost;
    }
}

module.exports = Searcher;