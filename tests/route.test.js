const RouteFileHandler = require('../src/handler/RouteFileHandler');
const routeMock = require('./mocks/routeMock');
const fs = require('fs');
const Manager = require('../src/manager/Manager');
const Validator = require('../src/util/Validator');
const Searcher = require('../src/service/Searcher')

const INPUT_FILE = './tests/resource/test-input.csv';
const INPUT_FILE_COPY = './tests/resource/test-input-copy.csv';

describe('RouteReader', () => {
    test('reader must return array of arrays after read from file', () => {
        let expectedRoutes = routeMock.ROUTES;

        let receivedRoutes = RouteFileHandler.readCsvToRoutes(INPUT_FILE);

        expect(receivedRoutes.length).toBe(expectedRoutes.length);
        expect(JSON.stringify(receivedRoutes)).toBe(JSON.stringify(expectedRoutes));
    });

    test('reader must throw error when path not found', () => {
        let crazyFileName = './tests/resource/any-crazy-file.csv';

        expect(() => {
            RouteFileHandler.readCsvToRoutes(crazyFileName);
        }).toThrow();
    });
});

describe('Manager', () => {
    let spyRouteFileHandlerWrite;
    let spyIsRouteValid;
    let spyIsSearchValid;

    beforeEach(() => {
        fs.copyFileSync(INPUT_FILE, INPUT_FILE_COPY);
        spyRouteFileHandlerWrite = jest.spyOn(RouteFileHandler, 'write');
        spyIsRouteValid = jest.spyOn(Validator, 'isRouteValid');
        spyIsSearchValid = jest.spyOn(Validator, 'isSearchValid');
    });

    afterEach(() => {
        spyRouteFileHandlerWrite.mockClear()
        spyIsRouteValid.mockClear()
        spyIsSearchValid.mockClear()

        fs.unlink(INPUT_FILE_COPY, (err) => {
            if (err) throw err;
        });
    });

    test('manager must add route when the pattern is correct', () => {
        const ROUTE = 'UUU,VVV,666';
        expect(new Manager(INPUT_FILE_COPY).addRoute(ROUTE)).toBe('route added');
        expect(spyRouteFileHandlerWrite).toHaveBeenCalledTimes(1);
        expect(spyRouteFileHandlerWrite).toHaveBeenCalledWith(ROUTE);
        expect(spyIsRouteValid).toHaveBeenCalledTimes(1);
    });

    test('manager must throw error when route to be added is not in the right pattern', () => {
        try {
            new Manager().addRoute('CRAZY QUERY ROUTE');
        } catch (e) {
            expect(e.message).toBe("invalid route");
        }
        expect(spyIsRouteValid).toHaveBeenCalledTimes(1);
    });

    test('manager must throw error when queryRoute is not in the right pattern', () => {
        try {
            new Manager().findCheapestRouteBy('CRAZY QUERY ROUTE');
        } catch (e) {
            expect(e.message).toBe("invalid search");
        }
        expect(spyIsSearchValid).toHaveBeenCalledTimes(1);
    });

    test('manager must find the best route given an valid route', () => {
        const QUERY_ROUTE = 'GRU-CDG';
        const expectedCheapestRoute = 'best route: GRU - BRC - SCL - ORL - CDG > $40'
        
        let receivedCheapestRoute = new Manager(INPUT_FILE).findCheapestRouteBy(QUERY_ROUTE);

        expect(spyIsSearchValid).toHaveBeenCalledTimes(1);
        expect(receivedCheapestRoute).toBe(expectedCheapestRoute);
    });    
});