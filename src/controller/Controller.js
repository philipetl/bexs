const Manager = require('../manager/Manager')

module.exports = (app) => {
    app.listen(3000, function () { });

    app.get('/route', function (req, res) {
        let result;
        try {
            result = Manager.getInstance().findCheapestRouteBy(req.query.route);
        } catch (e) {
            result = e.message;
            if (result == 'invalid search') {
                res.status(400);
            } else if (result == 'no routes') {
                res.status(404);
            } else{
                res.status(500);
            }
        }
        res.send(result);
    });

    app.post('/route', function (req, res) {
        let result;
        try {
            result = Manager.getInstance().addRoute(req.body.route);
        } catch (e) {
            result = e.message;
            if (result == 'invalid route') {
                res.status(400);
            } else if (result == 'route already exists') {
                res.status(409);
            } else {
                res.status(500);
            }
        }
        if (result == 'route added') {
            res.status(201);
        }
        res.send(result);
    });
}