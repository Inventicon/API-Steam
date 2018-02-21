const chalk = require("chalk");
const core = require("core");
const db = require("db");
const readline = require("readline");

console.log(chalk.redBright("== Auth Key Creator =="));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

db.initialize().then(() => {
    rl.question(chalk.blueBright("Owner: "), (owner) => {
        rl.question(chalk.blueBright("Domain: "), (domain) => {
            core.auth.create(owner, domain).then((key) => {
                console.log(chalk.magentaBright(" = Authorized! = "));
                console.log(chalk.greenBright("Key:"), key);

                rl.close();
            }).catch((error) => {
                console.log(chalk.redBright(" = Authorization Failed! = "));
                console.log("Error:", error);

                rl.close();
            });
        });
    });
});