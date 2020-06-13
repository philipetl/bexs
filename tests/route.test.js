const RouterReader = require('../src/reader/RouteReader');
const routeMock = require('./mocks/routeMock');

test('scenario #01 - reader must return array of arrays after read from file', () => {
    let expectedRoutes = routeMock.ROUTES;

    let receivedRoutes = RouterReader.readCsvToRoutes('./tests/resource/test-input.csv');

    expect(receivedRoutes.length).toBe(expectedRoutes.length);
    expect(JSON.stringify(receivedRoutes)).toBe(JSON.stringify(expectedRoutes));
});

test('scenario #02 - reader must return error when path not found', () => {
    let crazyFileName = './tests/resource/any-crazy-file.csv';

    expect(() => {
        RouterReader.readCsvToRoutes(crazyFileName);
    }).toThrow();
});