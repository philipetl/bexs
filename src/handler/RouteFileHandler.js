const fs = require('fs')
const path = require('path')
const Route = require('../domain/Route')

class RouteFileHandler {
    static #routes = [];
    static #filePath;
    static #fileLastUpdate;

    static readCsvToRoutes = (fileName = './src/resource/input-file.csv') => {
        this.#filePath = path.resolve(fileName)

        if (this.hasFileBeenUpdated()) {
        this.#routes = fs.readFileSync(this.#filePath)
            .toString()
            .split('\n')
            .map(l => l.trim())
            .map(l => l.split(',').map(c => c.trim()))
            .map(l => new Route(l[0], l[1], l[2]));
        }
        return this.#routes;
    }

    static write = (route) => fs.appendFileSync(this.#filePath, '\n' + route);

    static hasFileBeenUpdated = () => {
        const actualFileLastUpdate = fs.statSync(this.#filePath).mtime
        if (this.#fileLastUpdate == undefined
            || actualFileLastUpdate > this.#fileLastUpdate) {
            this.#fileLastUpdate = actualFileLastUpdate
            return true
        }
        return false
    }
}

module.exports = RouteFileHandler;