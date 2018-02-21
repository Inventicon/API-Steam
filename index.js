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

// Load core components
const core = require("core");
// Start database
const db = require("db");
// Start interface endpoints
const interfaces = require("./interfaces")(config, app);



// Display server information
console.log(`${chalk.blue("Steam API")} running on ":${chalk.green(config.port) + chalk.red(config.address)}"`);

// Start server
app.listen(config.port);