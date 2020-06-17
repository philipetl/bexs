/**
 * Classe de validações
 */
class Validator {
    /**
     * Valida se a busca está no padrão /^[A-Z]{3}-[A-Z]{3}$/
     * @param {string} search - String inserida pelo usuário
     * @example
     * // returns true
     * isSearchValid('AAA-BBB');
     * // returns false
     * isSearchValid('aaa-bbb');
     * // returns false
     * isSearchValid('aAA-BbB');
     * // returns false
     * isSearchValid('AAA,BBB');
     * // returns false
     * isSearchValid('ANYTHING');
     */
    static isSearchValid(search) {
        return /^[A-Z]{3}-[A-Z]{3}$/.test(search)
    }

    /**
     * Valida se a rota inserida está no padrão /^[A-Z]{3},[A-Z]{3},[\d]*$/
     * @param {string} route - String inserida pelo usuário
     * @example
     * // returns true
     * isRouteValid('AAA,BBB,420');
     * // returns true
     * isRouteValid('XPT,OAB,123');
     * // returns false
     * isRouteValid('aaa-bbb');
     * // returns false
     * isRouteValid('aaa,bbb,420');
     * // returns false
     * isRouteValid('ANYTHING');
     */
    static isRouteValid(route) {
        return /^[A-Z]{3},[A-Z]{3},[\d]*$/.test(route)
    }
}

module.exports = Validator;