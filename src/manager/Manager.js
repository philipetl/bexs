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
     * @returns {Manager} Instância atual do Manager
     */
    static getInstance() {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }

    /**
     * Responsável pelo carregamento de todas as rotas do arquivo em memória
     * @param {object} param - Pode ser um filePath ou um array de Routes
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
     * Responsável por realizar a busca da rota
     * @param {string} search - String de busca inserida pelo usuário
     * @returns {string} Retorna uma string formatada com a rota mais barata e mais curta
     */
    findCheapestAndShorterRoute(search) {
        if (!Validator.isSearchValid(search)) throw new Error('invalid search');
        let [origin, destination] = search.split('-');

        return Searcher.getInstance()
            .build(Object.assign([], this.allRoutes))
            .find(origin, destination);
    }

    /**
     * Responsável por realizar a inclusão de uma nova rota no arquivo atual
     * @param {string} routeStr - rota em formato de string
     * @returns {string} mensagem de sucesso ou exceção
     */
    addRoute(routeStr) {
        if (!Validator.isRouteValid(routeStr)) throw new Error('invalid route');

        let [origin, destination, cost] = routeStr.split(',');

        if (this.allRoutes.some(r => JSON.stringify(r) == JSON.stringify([origin, destination, cost]))) {
            throw new Error('route already exists');
        }

        RouteFileHelper.write(routeStr);
        this.load([origin, destination, cost]);

        return 'route created';
    }
}

module.exports = Manager;