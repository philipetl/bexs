const Manager = require('../manager/Manager')

module.exports = (app) => {
    app.listen(3000, function () { });

    app.get('/getCheapestRoute', function (req, res) {
        let result;
        try{
            result = (new Manager()).findCheapestRouteBy(req.query.route);
        } catch(e){
            result = e.message;
            res.status(500);
        }
        res.send(result);
    });

    app.post('/addRoute', function (req, res) {
        let result;
        try{
            result = (new Manager()).addRoute(req.body.route);
        } catch(e){
            result = e.message;
            res.status(500);
        }
        res.send(result);
    });
}