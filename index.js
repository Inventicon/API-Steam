const chalk = require("chalk");
const express = require("express");

let config = require("./config.json");
// Default fallback configuration
config = {
    address: config.address || "/",
    port: config.port || 3000,
    key: config.key || null,
    format: "json"
};

let app = express();

app.get(config.address, function (req, res) {
    res.send("Hello World");
});

console.log(`${chalk.blue("Steam API")} running on ":${chalk.green(config.port) + chalk.red(config.address)}"`);
app.listen(config.port);