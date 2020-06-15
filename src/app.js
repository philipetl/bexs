const app = require('./config/CustomExpress');
const readline = require('readline');
const { exit } = require('process');
const getVerifyRouteFile = require('./helper/RouteFile').getVerifyRouteFile
const Manager = require('./manager/Manager');

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
                result = Manager.getInstance().findCheapestRouteBy(queryRoute);
            } catch (e) {
                result = e.message;
            }
            console.log(result);
            waitForUserInput();
        }
    });
}

exports.init = () => {
    try {
        let param = process.argv[2]
        param = getVerifyRouteFile(param);

        console.log('source file: ' + param);
        Manager.getInstance().load(param);

        waitForUserInput(); 
    } catch (e) {
        console.log(e.message);
        exit();
    }
};