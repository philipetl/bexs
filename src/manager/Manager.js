const RouteFileHelper = require('../helper/RouteFile');
const Validator = require('../helper/Validator');
const Searcher = require('../service/Searcher');

/**
 * Classe responsável por realizar a orquestração da busca, pois possui
 * os métodos utilizados tanto pelas requisições via REST quanto pelas
 * consultas via linha de comando.
 */
class Manager {
    static instance;
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
            this.allRoutes = this.allRoutes.concat([param]);
        }
        return this;
    }

    /**
     * Recebe a string (ex.: AAA,BBB,20) e insere no arquivo utilizado
     * @param {string} queryRoute - string no padrão: /^[A-Z]{3}-[A-Z]{3}$/
     * @returns {string} Retorna uma string formatada da seguinte forma: "best route: AAA - BBB - CCC > $30\"
     */
    findCheapestRouteBy(queryRoute) {
        if (!Validator.isSearchValid(queryRoute)) throw new Error('invalid search');
        let [origin, destination] = queryRoute.split('-');

        return Searcher.getInstance()
            .build(Object.assign([], this.allRoutes))
            .find(origin, destination);
    }

    /**
     * Recebe a string (ex.: AAA,BBB,20) e insere no arquivo atualmente utilizado
     * @param {string} routeStr - string no padrão /^[A-Z]{3},[A-Z]{3},[\d]*$/
     * @returns {string} mensagem
     */
    addRoute(routeStr) {
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