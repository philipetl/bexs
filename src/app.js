const app = require('./config/customExpress');
const readline = require('readline');
const { exit } = require('process');

const RouterReader = require('./reader/RouteReader')

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

waitForUserInput = () => {
    rl.question("please enter the route: ", function (queryRoute) {
        if (queryRoute == "exit") {
            rl.close();
            exit();
        } else {
            console.log(RouterReader.readCsvToRoutes());
            waitForUserInput();
        }
    });
}

waitForUserInput();