const db = require("db");

module.exports = {
    features: {
        getFeatures: getGameFeatures,
        cacheFeature: cacheGameFeature
    }
};

function getGameFeatures(appid) {
    return db.getFeatures(appid);
}

function cacheGameFeature(appid, name, icon, url) {
    console.log("Caching:", appid, name);
    db.saveFeature(appid, name, icon, url);
}