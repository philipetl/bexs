class Validator {
    static isSearchValid(queryRoute) {
        return /^[A-Z]{3}-[A-Z]{3}$/.test(queryRoute)
    }

    static isRouteValid(route) {
        return /^[A-Z]{3},[A-Z]{3},[\d]*$/.test(route)
    }
}

module.exports = Validator