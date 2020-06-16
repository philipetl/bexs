class PossibleRoute {
    routes = [];
    totalCost = 0;

    constructor(route, isFinished = false) {
        this.routes.push(route);
        this.totalCost += parseInt(route.cost);
        this.isFinished = isFinished;
    }
}

module.exports = PossibleRoute;