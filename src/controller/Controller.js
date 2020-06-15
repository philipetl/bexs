const Manager = require('../manager/Manager')

module.exports = (app) => {
    app.listen(3000, function () { });

    app.get('/route', function (req, res) {
        let result;
        try{
            result = Manager.getInstance().findCheapestRouteBy(req.query.route);
        } catch(e){
            result = e.message;
            res.status(500);
        }
        res.send(result);
    });

    app.post('/route', function (req, res) {
        let result;
        try{
            result = Manager.getInstance().addRoute(req.body.route);
        } catch(e){
            result = e.message;
            res.status(500);
        }
        res.send(result);
    });
}