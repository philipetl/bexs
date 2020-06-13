const Route = require("../../app/Route");

exports.ROUTES = [
    new Route('GRU', 'BRC', "10"),
    new Route('BRC', 'SCL', "5"),
    new Route('GRU', 'CDG', "75"),
    new Route('GRU', 'SCL', "20"),
    new Route('GRU', 'ORL', "56"),
    new Route('ORL', 'CDG', "5"),
    new Route('SCL', 'ORL', "20")
];