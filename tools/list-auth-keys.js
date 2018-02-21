const chalk = require("chalk");
const core = require("core");
const db = require("db");
const readline = require("readline");

console.log(chalk.redBright("== Auth Key Lister =="));

db.initialize().then(() => {
    core.auth.getAll().then(keys => {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            console.log(chalk.redBright(" = Key #" + i.toString() + " = "));
            console.log("Key", chalk.greenBright(key.key));
            console.log("Owner:", chalk.blueBright(key.owner));
            console.log("Domain:", chalk.magentaBright(key.domain));
        }
    });
});