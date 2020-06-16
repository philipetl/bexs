const RouteFileHelper = require('../helper/RouteFile');
const Validator = require('../helper/Validator');
const Route = require('../domain/Route');
const Searcher = require('../service/Searcher');

/**
 * Classe responsável por realizar a orquestração da busca, pois possui
 * os métodos utilizados tanto pelas requisições via REST quanto pelas
 * consultas via linha de comando.
 */
class Manager {
    static #instance;
    allRoutes = [];
    searcher;

    /**
     * Responsável por ter sempre a instância atual do Manager
     * @returns {Manager} instância atual do Manager
     */
    static getInstance() {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }

    /**
     * Responsável pelo carregamento de todas as rotas em memória
     * @param {object} param - string|Route|Route array
     */
    load(param) {
        if (typeof param === 'string') {
            this.allRoutes = RouteFileHelper.readCsvToRoutes(param);
        } else if (Array.isArray(param)) {
            this.allRoutes = this.allRoutes.concat(param);
        } else if (param instanceof Route) {
            this.allRoutes.push(param);
        }
        return this;
    }

    /**
     * Responsável por ter sempre a instância atual do Searcher
     * @returns {Searcher} instância atual do Searcher
     */
    getSearcher() {
        if (!this.searcher) {
            this.searcher = new Searcher(this.allRoutes);
        }
        return this.searcher;
    }

    /**
     * Recebe a string (ex.: AAA,BBB,20) e insere no arquivo utilizado
     * @param {string} queryRoute - string no padrão: /^[A-Z]{3}-[A-Z]{3}$/
     * @returns {string} Retorna uma string formatada da seguinte forma: "best route: AAA - BBB - CCC > $30\"
     */
    findCheapestRouteBy(queryRoute) {
        if (!Validator.isSearchValid(queryRoute)) throw new Error('invalid search');
        let [origin, destination] = queryRoute.split('-');

        return this.getSearcher().searchCheapestRouteFormatted(origin, destination, this.allRoutes);
    }

    /**
     * Recebe a string (ex.: AAA,BBB,20) e insere no arquivo atualmente utilizado
     * @param {string} routeStr - string no padrão /^[A-Z]{3},[A-Z]{3},[\d]*$/
     * @returns {string} mensagem
     */
    addRoute(routeStr) {
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