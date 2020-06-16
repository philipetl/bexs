const RouteFileHelper = require('../helper/RouteFile');
const Validator = require('../helper/Validator');
const Route = require('../domain/Route');
const Searcher = require('../service/Searcher');

class Manager {
    static #instance;
    allRoutes = [];
    searcher;

    static getInstance = () => {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }

    load = (param) => {
        if (typeof param === 'string') {
            this.allRoutes = RouteFileHelper.readCsvToRoutes(param);
        } else if (Array.isArray(param)) {
            this.allRoutes = this.allRoutes.concat(param);
        } else if (param instanceof Route) {
            this.allRoutes.push(param);
        }
        return this;
    }

    _getSearcher = () => {
        if (!this.searcher) {
            this.searcher = new Searcher(this.allRoutes);
        }
        return this.searcher;
    }

    findCheapestRouteBy = (queryRoute) => {
        if (!Validator.isSearchValid(queryRoute)) throw new Error('invalid search');
        let [origin, destination] = queryRoute.split('-');

        return this._getSearcher().searchCheapestRouteFormatted(origin, destination, this.allRoutes);
    }

    addRoute = (routeStr) => {
        if (!Validator.isRouteValid(routeStr)) throw new Error('invalid route');

        let [origin, destination, cost] = routeStr.split(',');
        let route = new Route(origin, destination, cost);
        if (this.allRoutes.some(r => JSON.stringify(r) == JSON.stringify(route))) {
            throw new Error('route already exists');
        }
        RouteFileHelper.write(routeStr);

        this.load(route);

        return 'route added';
    }
}

module.exports = Manager;