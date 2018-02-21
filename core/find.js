const BigNumber = require("bignumber.js");
const axios = require("axios");

module.exports = {
    user64: getSteamUserId64
};

async function getSteamUserId64(key, id) {
    return new Promise((resolve, reject) => {
        try {
            convertVanity(key, id, (result) => { // Try to get vanity name from id
                if (result) {
                    resolve(result);
                } else {
                    resolve(convertTo64(id));
                }
            });
        } catch (error) {
            reject();
        }
    });
}

const steamID64Identifier = BigNumber("76561197960265728");
const resolveVanity = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001";

function convertVanity(key, base, cb) {
    if (typeof cb !== "function") throw new Error("Callback required");

    axios.get(resolveVanity, {
        params: {
            key: key,
            vanityurl: base
        }
    }).then(response => {
        if (response.data.response.success === 1) {
            cb(response.data.response.steamid);
        } else {
            cb(undefined);
        }
    }).catch(error => {
        console.log(error);
    });
}

function convertTo64(steamid) {
    let v = steamID64Identifier;
    let sidSplit;
    let z;
    let y;

    if (!steamid) {
        return;
    } else if (typeof steamid !== "string") {
        return;
    } else {
        sidSplit = steamid.split(':');
        z = sidSplit[2];
        y = sidSplit[1];
    }

    if (z && y) {
        return v.plus(z*2).plus(y).toPrecision(17);
    }
}