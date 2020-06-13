const RouterReader = require('../app/RouteReader')

test('scenario #01 - reader must return array of arrays after read from file', () => {
    let expectedData = [
        ['GRU', 'BRC', '10'],
        ['BRC', 'SCL', '5'],
        ['GRU', 'CDG', '75'],
        ['GRU', 'SCL', '20'],
        ['GRU', 'ORL', '56'],
        ['ORL', 'CDG', '5'],
        ['SCL', 'ORL', '20']
    ];

    let receivedData = RouterReader.readCsvToRoutes('./src/__tests__/resource/test-input.csv');

    expect(expectedData.length).toBe(receivedData.length);
    expect(JSON.stringify(expectedData)).toBe(JSON.stringify(receivedData));
});

test('scenario #02 - reader must return error when path not found', () => {
    let crazyFileName = './src/__tests__/resource/any-crazy-file.csv';

    expect(() => {
        RouterReader.readCsvToRoutes(crazyFileName);
    }).toThrow();
});