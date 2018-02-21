const chalk = require("chalk");
const core = require("core");
const db = require("db");
const readline = require("readline");

console.log(chalk.red("== Auth Key Creator =="));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

db.initialize().then(() => {
    rl.question(chalk.blue("Owner: "), (owner) => {
        rl.question(chalk.blue("Domain: "), (domain) => {
            core.auth.create(owner, domain).then((key) => {
                console.log(chalk.magenta(" = Authorized! = "));
                console.log(chalk.green("Key:"), key);

                rl.close();
            }).catch((error) => {
                console.log(chalk.red(" = Authorization Failed! = "));
                console.log("Error:", error);

                rl.close();
            });
        });
    });
});