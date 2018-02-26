const db = require("db");

module.exports = {
    exists: authExists,
    create: authCreate,
    getAll: getRegisteredKeys
};

async function authExists(key) {
    return await db.checkForKey(key);
}

async function authCreate(owner, domain) {
    let key = generateKey(8);
    while (await authExists(key)) {
        key = generateKey(8);
    }

    let success = await db.registerAuth(key, owner, domain);
    if (success) {
        return key;
    }
    throw "Failed to register generated key!";
}

function generateKey(length) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    let key = "";
    for (let i=0; i<(length / 4); i++) {
        key += s4();
    }
    return key.substr(0, length);
}

async function getRegisteredKeys() {
    let keys = await db.getAuthKeys();
    return keys;
}