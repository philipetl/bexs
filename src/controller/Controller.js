const Manager = require('../manager/Manager')

module.exports = (app) => {
    app.listen(3000, function () { });

    app.get('/getCheapestRoute', function (req, res) {
        res.send(new Manager().findCheapestRouteBy(req.query.route));
    });

    app.post('/addRoute', function (req, res) {
        res.send(new Manager().addRoute(req.body.route));
    });
}