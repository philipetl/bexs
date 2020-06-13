const app = require('./src/config/custom-express');
const readline = require('readline');
const { exit } = require('process');

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
            console.log(queryRoute);
            waitForUserInput();
        }
    });
}

waitForUserInput();