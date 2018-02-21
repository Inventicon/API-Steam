const path = require("path");
const sqlite = require("sqlite");

const database = path.resolve("./database.sqlite");

module.exports = {
    DB: DB
};

function DB() {

}

DB.prototype.initialize = function() {
    sqlite.open('./database.sqlite', { cached: true });
};