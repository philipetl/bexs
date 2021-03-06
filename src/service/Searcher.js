const Route = require('../domain/Route');
const util = require('util');

/**
 * Responsável por realizar a busca de rotas
 */
class Searcher {
    static instance;
    paths = {};
    allRoutes;

    /**
     * Responsável por retornar sempre a instância atual do Searcher
     * @returns {Searcher} Instância atual do Searcher
     */
    static getInstance = () => {
        if (!Searcher.instance) {
            Searcher.instance = new Searcher();
        }
        return Searcher.instance;
    }

    /**
     * Responsável por montar todos os dados do array de string
     * vindas do arquivo um dicionário de Rotas
     * @param {string[]} allRoutesArray - Array de rotas vindas do arquivo 
     */
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

    /**
     * Método chamado pelo Manager, responsável por gerenciar como a busca ocorre  
     * @param {string} origin - Origem procurada pelo usuário
     * @param {*} destination - Destino procurado pelo usuário
     * @returns {string} Retorna a string com a rota mais barata e de menor tamanho
     */
    find(origin, destination) {
        let originRoute = this.allRoutes[origin];
        if (!originRoute) {
            throw new Error('route not found');
        }

        let possibleRoutes = originRoute.next(this.allRoutes);
        this._deepSearch(possibleRoutes, destination);

        let entries = Object.entries(this.paths);
        if (!entries.length) {
            throw new Error('route not found');
        }
        let sortedByPathLength = entries.sort((a, b) => a[0].length - b[0].length);
        let sortedByCost = sortedByPathLength.sort((a, b) => a[1] - b[1]);

        return this._formatString(sortedByCost[0]);
    }

    /**
     * Responsável por percorrer recursivamente as rotas e montar os paths para o destino procurado
     * @param {Route} route - Rota
     * @param {string} destination - Destino desejado
     * @param {int} cost - Custo das rotas a ser somado para um determinado caminho
     * @param {string} path - Caminho das rotas incrementado durante as iterações
     * @returns {string[]} Retorna um map com as chaves são as rotas e os valores são
     * os custos daquelas rotas
     */
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

    /**
     * Responsável por formatar a rota como solicitado
     * @param {string} bestRoute - Melhor (mais barata e mais curta) a ser formatada
     * @returns {string} Retorna a rota formatada
     */
    _formatString(bestRoute) {
        let path = bestRoute[0].replace(/-([^-]*)$/, '$1').trim();
        return 'best route: ' + path + ' > $' + bestRoute[1];
    }
}

module.exports = Searcher;