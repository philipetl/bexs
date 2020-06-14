const app = require('./config/customExpress');
const readline = require('readline');
const { exit } = require('process');

const Manager = require('./Manager/Manager')

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
            let result;

            try {
                result = new Manager().findCheapestRouteBy(queryRoute);
            } catch (e) {
                result = e.message;
            }
            console.log(result);
            waitForUserInput();
        }
    });
}

waitForUserInput();