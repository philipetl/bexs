module.exports = (app) => {
    app.listen(3000, function () { });

    app.get('/getCheapestRoute', function (req, res) {
        res.send(req.query.route);
    });

    app.post('/addRoute', function (req, res) {
        res.send(req.body.route);
    });
}