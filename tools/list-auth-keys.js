const chalk = require("chalk");
const core = require("core");
const db = require("db");
const readline = require("readline");

console.log(chalk.red("== Auth Key Lister =="));

db.initialize().then(() => {
    core.auth.getAll().then(keys => {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            console.log(chalk.red(" = Key #" + i.toString() + " = "));
            console.log("Key", chalk.green(key.key));
            console.log("Owner:", chalk.blue(key.owner));
            console.log("Domain:", chalk.magenta(key.domain));
        }
    });
});