const fs = require('fs');
const routeMock = require('./mocks/routeMock');
const Manager = require('../src/manager/Manager');
const Validator = require('../src/helper/Validator');
const RouteFileHandler = require('../src/helper/RouteFile');

const VALID_INPUT = './tests/resource/valid-input.csv';
const VALID_INPUT_COPY = './tests/resource/valid-input-copy.csv';

const INVALID_INPUT = './tests/resource/invalid-input.csv';

describe('helper/RouteFile', () => {
    test('reader must return array of arrays after read from file', () => {
        let expectedRoutes = routeMock.ROUTES;

        let receivedRoutes = RouteFileHandler.readCsvToRoutes(VALID_INPUT);

        expect(receivedRoutes.length).toBe(expectedRoutes.length);
        expect(JSON.stringify(receivedRoutes)).toBe(JSON.stringify(expectedRoutes));
    });

    test('reader must throw error when path not found', () => {
        let crazyFileName = './tests/resource/any-crazy-file.csv';

        expect(() => {
            RouteFileHandler.getVerifyRouteFile(crazyFileName);
        }).toThrow();
    });

    test('reader must throw error when invalid file is provided', () => {
        expect(() => {
            RouteFileHandler.getVerifyRouteFile(INVALID_INPUT);
        }).toThrow();
    });
});

describe('Manager', () => {
    let spyRouteFileHandlerWrite;
    let spyIsRouteValid;
    let spyIsSearchValid;

    beforeEach(() => {
        fs.copyFileSync(VALID_INPUT, VALID_INPUT_COPY);
        spyRouteFileHandlerWrite = jest.spyOn(RouteFileHandler, 'write');
        spyIsRouteValid = jest.spyOn(Validator, 'isRouteValid');
        spyIsSearchValid = jest.spyOn(Validator, 'isSearchValid');
    });

    afterEach(() => {
        spyRouteFileHandlerWrite.mockClear();
        spyIsRouteValid.mockClear();
        spyIsSearchValid.mockClear();

        fs.unlink(VALID_INPUT_COPY, (err) => {
            if (err) throw err;
        });
    });

    test('manager must add route when the pattern is correct', () => {
        const ROUTE = 'UUU,VVV,420';
        const QUERY_ROUTE = 'UUU-VVV';

        expect(Manager.getInstance().load(VALID_INPUT_COPY).addRoute(ROUTE)).toBe('route added');
        expect(spyIsRouteValid).toHaveBeenCalledTimes(8);
        expect(spyRouteFileHandlerWrite).toHaveBeenCalledTimes(1);
        expect(spyRouteFileHandlerWrite).toHaveBeenCalledWith(ROUTE);

        const expectedCheapestRoute = 'best route: UUU - VVV > $420'
        const receivedCheapestRoute = Manager.getInstance().findCheapestRouteBy(QUERY_ROUTE);

        expect(spyIsSearchValid).toHaveBeenCalledTimes(1);
        expect(receivedCheapestRoute).toBe(expectedCheapestRoute);
    });

    test('manager must throw error when route to be added is not in the right pattern', () => {
        try {
            Manager.getInstance().addRoute('CRAZY QUERY ROUTE');
        } catch (e) {
            expect(e.message).toBe("invalid route");
        }
        expect(spyIsRouteValid).toHaveBeenCalledTimes(1);
    });

    test('manager must throw error when queryRoute is not in the right pattern', () => {
        try {
            new Manager().findCheapestRouteBy('CRAZY SEARCH ROUTE');
        } catch (e) {
            expect(e.message).toBe("invalid search");
        }
        expect(spyIsSearchValid).toHaveBeenCalledTimes(1);
    });

    test('manager must find the best route given an valid route', () => {
        const QUERY_ROUTE = 'GRU-CDG';
        const expectedCheapestRoute = 'best route: GRU - BRC - SCL - ORL - CDG > $40'

        let receivedCheapestRoute = Manager.getInstance().load(VALID_INPUT).findCheapestRouteBy(QUERY_ROUTE);

        expect(spyIsSearchValid).toHaveBeenCalledTimes(1);
        expect(receivedCheapestRoute).toBe(expectedCheapestRoute);
    });
});