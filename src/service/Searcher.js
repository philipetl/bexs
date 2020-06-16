const PossibleRoute = require('../domain/PossibleRoute');
const Route = require('../domain/Route');
const util = require('util');
const { timeStamp } = require('console');

let possibleRoutes;

class Searcher {
    constructor(allRoutesArray) {
        console.clear();
        this.allRoutes = allRoutesArray
            .map(i => new Route(i[0], 0, allRoutesArray.filter(j => j[0] == i[0]).map(j => new Route(j[1], j[2]))))
            .reduce((result, item) => {
                result[item.origin] = item;
                return result;
            }, {});

        //console.log(util.inspect(this.allRoutes, { showHidden: false, depth: null }));

        allRoutesArray.filter(i => this.allRoutes[i[1]] === undefined)
            .forEach(i => this.allRoutes[i[1]] = new Route(i[1], 0, []));

        //let originalAllRoutes = Object.assign({}, this.allRoutes);

        //console.log(util.inspect(this.allRoutes, { showHidden: false, depth: null }))

        let keys = Object.keys(this.allRoutes);
        for (let i; i < keys.length; i++) {
            let key = keys[i];
            this.allRoutes = { ...this.allRoutes, [key]: this.allRoutes[key].next(this.allRoutes) };
        }

        // this.allRoutes = Object.keys(this.allRoutes).map(k => this.allRoutes[k].next(this.allRoutes))
        //     .reduce((result, item) => {
        //         result[item.origin] = item;
        //         return result;
        //     }, {});

        console.log(util.inspect(this.allRoutes, { showHidden: false, depth: null }));

        this.search(this.allRoutes['GRU'], 'CDG');
    }

    search = (route, destination, cost = 0, path = '') => {
        cost += parseInt(route.cost);
        path += route.origin + ' - ';
        if (route.origin == destination) {
            console.log(path, cost);
        } else {
            route.destinations.forEach(r => {
                this.search(r, destination, cost, path);
            });
        }
    }
    searchCheapestRouteFormatted = (origin, destination) => {
        possibleRoutes = [];
        this._NEWcalcPossibleRoutes(origin, destination);

        if (possibleRoutes.length == 0) throw new Error('no routes');

        let [bestRoute, bestRouteCost] = this._getCheapestRoute(possibleRoutes);
        return this._formatString(bestRoute, bestRouteCost);
    }

    _calcPossibleRoutes = (origin, destination, previousRoutes = []) => {
        this.allRoutes.forEach(route => {
            if (route.origin == origin) {
                previousRoutes.push(route);
                if (route.destination == destination) {
                    possibleRoutes.push(previousRoutes);
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

    // _NEWcalcPossibleRoutes = (origin, destination, possibleRoutes = this.allRoutes) => {
    //     possibleRoutes = possibleRoutes.filter(ps => ps.origin == origin)
    //         .map(ps => new PossibleRoute(ps, ps.destination == destination));

    //     this._MetodoSeparado(possibleRoutes, destination);
    // }

    // _MetodoSeparado = (possibleRoutes, destination) => {
    //     if (possibleRoutes.length == 0
    //         || possibleRoutes.filter(ps => ps.isFinished).length == possibleRoutes.length) {
    //         return;
    //     }

    //     console.log(possibleRoutes);

    //     if (possibleRoutes.filter(ps => ps.isFinished).length > 0) {
    //         let currentMinCost = possibleRoutes.filter(ps => ps.isFinished)
    //             .map(ps => parseInt(ps.totalCost)).reduce((a, b) => a < b ? a : b, Number.MAX_SAFE_INTEGER);

    //         possibleRoutes = possibleRoutes.map(ps => {
    //             if (ps.isFinished || ps.totalCost <= currentMinCost) {
    //                 return ps;
    //             }
    //         });
    //     }
    //     console.log(possibleRoutes);

    //     possibleRoutes
    //         .forEach(ps => this._NEWcalcPossibleRoutes(ps.routes[ps.routes.length - 1], destination));
    // }




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