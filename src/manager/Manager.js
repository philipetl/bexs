const RouteReader = require('../reader/RouteReader');
const Validator = require('../util/Validator');
const Route = require('../domain/Route');

class Manager {
    constructor(filePath) {
        this.allRoutes = RouteReader.readCsvToRoutes(filePath);
    }

    findCheapestRouteBy = (queryRoute) => {
        if (!Validator.isSearchValid(queryRoute)) throw new Error('invalid search');
        return this.allRoutes;
    }

    addRoute = (routeStr) => {
        if (!Validator.isRouteValid(routeStr)) throw new Error('invalid route');

        let [origin, destination, cost] = routeStr.split(',');
        let route = new Route(origin, destination, cost);
        if (this.allRoutes.some(r => JSON.stringify(r) == JSON.stringify(route))) {
            throw new Error('route already exists');
        }
        RouteReader.write(routeStr);

        return 'route added';
    }
}

module.exports = Manager;