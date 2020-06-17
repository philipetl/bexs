const PossibleRoute = require('../domain/PossibleRoute');
const Route = require('../domain/Route');
const util = require('util');

class Searcher {
    static instance;
    paths = {};
    allRoutes;

    static getInstance = () => {
        if (!Searcher.instance) {
            Searcher.instance = new Searcher();
        }
        return Searcher.instance;
    }

    build(allRoutesArray = []) {
        this.allRoutes = allRoutesArray
            .map(i => new Route(i[0], 0, allRoutesArray.filter(j => j[0] == i[0])
                .map(j => new Route(j[1], j[2], []))))
            .reduce((result, item) => {
                result[item.origin] = item;
                return result;
            }, {});

        allRoutesArray.filter(i => this.allRoutes[i[1]] === undefined)
            .forEach(i => this.allRoutes[i[1]] = new Route(i[1], 0, []));

        this.paths = {};
        return this;
    }

    find(origin, destination) {
        let originRoute = this.allRoutes[origin];
        if (!originRoute) {
            throw new Error('route not found');
        }
        let possibleRoutes = this.allRoutes[origin].next(this.allRoutes);
        // console.log(util.inspect(possibleRoutes, { showHidden: false, depth: null }));
        this._deepSearch(possibleRoutes, destination);

        let entries = Object.entries(this.paths);

        if (!entries.length) {
            throw new Error('route not found');
        }
        let sorted = entries.sort((a, b) => a[0].length - b[0].length).sort((a, b) => a[1] - b[1]);

        return this._formatString(sorted[0]);
    }

    _deepSearch(route, destination, cost = 0, path = '') {
        cost += parseInt(route.cost);
        path += route.origin + ' - ';
        if (route.origin == destination) {
            this.paths[path] = cost;
        } else {
            route.destinations.forEach(r => {
                this._deepSearch(r, destination, cost, path);
            });
        }
    }

    _formatString(bestRoute) {
        let path = bestRoute[0].replace(/-([^-]*)$/, '$1').trim();
        return 'best route: ' + path + ' > $' + bestRoute[1];
    }
}


module.exports = Searcher;