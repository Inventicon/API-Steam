const path = require("path");
const Promise = require("bluebird");
const sqlite = require("sqlite");

const dbPromise = sqlite.open("./steam.sqlite", { Promise });

class DB {
    static async initialize() {
        await this._createTables();
    }

    static async _createTables() {
        const db = await dbPromise;
        await db.run("CREATE TABLE IF NOT EXISTS authorized (key VARCHAR(32) UNIQUE PRIMARY KEY, owner VARCHAR(511), domain VARCHAR(255));");
    }

    static async registerAuth(key, owner, domain) {
        const db = await dbPromise;
        await Promise.all([
            db.run(`INSERT INTO authorized (key, owner, domain) VALUES (?, ?, ?)`, key, owner, domain),
        ]);
        return key;
    }

    static async checkForKey(key) {
        const db = await dbPromise;
        const [rows] = await Promise.all([
            db.get("SELECT COUNT(*) FROM authorized WHERE key = (?);", key),
        ]);
        return rows !== undefined;
    }
}

module.exports = DB;