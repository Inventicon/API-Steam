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
        await db.run("CREATE TABLE IF NOT EXISTS authorized (key VARCHAR(8) UNIQUE PRIMARY KEY, owner VARCHAR(511), domain VARCHAR(255));");
        await db.run("CREATE TABLE IF NOT EXISTS features (appid INT, name VARCHAR(255), icon VARCHAR(255), url VARCHAR(255));");
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
        let [count] = await Promise.all([
            db.get("SELECT COUNT(*) FROM authorized WHERE key = (?);", key),
        ]);
        count = count["COUNT(*)"];
        return count !== 0;
    }

    static async getAuthKeys() {
        const db = await dbPromise;
        return await Promise.all([
            db.get("SELECT * FROM authorized"),
        ]);
    }

    static async getFeatures(appid) {
        const db = await dbPromise;
        let [data] = await Promise.all([
            db.all("SELECT * FROM features WHERE appid = (?);", appid),
        ]);
        return data;
    }

    static async saveFeature(appid, name, icon, url) {
        const db = await dbPromise;
        return db.run(`INSERT INTO features (appid, name, icon, url) VALUES (?, ?, ?, ?)`, appid, name, icon, url);
    }
}

module.exports = DB;