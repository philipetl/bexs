const RouteFileHelper = require('../helper/RouteFile');
const Validator = require('../helper/Validator');
const Searcher = require('../service/Searcher');

class Manager {
    static instance;
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
            this.allRoutes = this.allRoutes.concat([param]);
        }

        return this;
    }

    findCheapestRouteBy = (queryRoute) => {
        if (!Validator.isSearchValid(queryRoute)) throw new Error('invalid search');
        let [origin, destination] = queryRoute.split('-');

        return Searcher.getInstance()
            .build(Object.assign([], this.allRoutes))
            .find(origin, destination);
    }

    addRoute = (routeStr) => {
        if (!Validator.isRouteValid(routeStr)) throw new Error('invalid route');

        let [origin, destination, cost] = routeStr.split(',');

        if (this.allRoutes.some(r => JSON.stringify(r) == JSON.stringify([origin, destination, cost]))) {
            throw new Error('route already exists');
        }

        RouteFileHelper.write(routeStr);
        this.load([origin, destination, cost]);

        return 'route added';
    }
}

module.exports = Manager;