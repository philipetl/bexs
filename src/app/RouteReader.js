const fs = require('fs')
const path = require('path')
const Route = require('./Route')

class RouterReader {
    static #routes = []
    static #filePath

    static readCsvToRoutes = (fileName = './src/resource/input-file11111111111.txt') => {
        this.#filePath = path.resolve(fileName)

        this.#routes = fs.readFileSync(this.#filePath)
            .toString()
            .split('\n')
            .map(l => l.trim())
            .map(l => l.split(',').map(c => c.trim()))
            .map(l => new Route(l[0], l[1], l[2]));

        return this.#routes;
    }

    static write = (route) => fs.appendFileSync(this.#filePath, '\n' + route);
}

module.exports = RouterReader