const fs = require('fs')
const path = require('path')
const Route = require('../domain/Route');
const { FILE } = require('dns');
const Validator = require('./Validator');

const FILE_PATH_TO_RESOURCE = './src/resource/input-file.csv';

/**
 * Classe responsável pela leitura e escrita do arquivo atual
 */
class RouteFileHandler {
    static #routes = [];
    static #filePath;
    static #fileLastUpdate;

    /**
     * Responsável por ler o arquivo informado
     * @param {string} filePath - caminho do arquivo a ser utilizado
     * @returns {Route[]} array com todas as rotas encontrada
     */
    static readCsvToRoutes(filePath = FILE_PATH_TO_RESOURCE) {
        this.#filePath = this.getVerifyRouteFile(filePath);

        if (this.hasFileBeenUpdated()) {
            this.#routes = fs.readFileSync(this.#filePath)
                .toString()
                .split('\n')
                .map(l => l.trim())
                .map(l => l.split(',').map(c => c.trim()))
                .map(l => [l[0], l[1], l[2]]);
        }
        return this.#routes;
    }

    /**
     * Responsável pela verificação do arquivo
     * @param {string} filePath - caminho do arquivo a ser verificado
     * @returns {string} caminho validado: arquivo existe e não possui rotas inválidas
     */
    static getVerifyRouteFile(filePath) {
        if (!filePath) {
            filePath = FILE_PATH_TO_RESOURCE;
        }

        filePath = path.resolve(filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error('file not found or file without read permission');
        }

        fs.readFileSync(filePath)
            .toString()
            .split('\n')
            .map(l => l.trim())
            .map(l => l.split(',').map(c => c.trim()))
            .forEach(l => {
                if (!Validator.isRouteValid(l)) {
                    throw new Error('file contains invalid route(s)');
                }
            });

        return filePath;
    }

    /**
     * Responsável por escrever a string da rota no arquivo atual
     * @param {string} route 
     */
    static write(route) {
        fs.appendFileSync(this.#filePath, '\n' + route);
    }

    /**
     * Responsável por verificar se o arquivo foi alterado.
     */
    static hasFileBeenUpdated() {
        const actualFileLastUpdate = fs.statSync(this.#filePath).mtime;
        if (this.#fileLastUpdate == undefined
            || actualFileLastUpdate > this.#fileLastUpdate) {
            this.#fileLastUpdate = actualFileLastUpdate;
            return true;
        }
        return false;
    }
}

module.exports = RouteFileHandler;