const RouteReader = require('../handler/RouteFileHandler');
const Validator = require('../util/Validator');
const Route = require('../domain/Route');
const Searcher = require('../service/Searcher')

class Manager {
    constructor(filePath) {
        this.allRoutes = RouteReader.readCsvToRoutes(filePath);
        this.searcher = new Searcher(this.allRoutes);
    }

    findCheapestRouteBy = (queryRoute) => {
        if (!Validator.isSearchValid(queryRoute)) throw new Error('invalid search');
        let [origin, destination] = queryRoute.split('-');

        return this.searcher.searchCheapestRouteFormatted(origin, destination);
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