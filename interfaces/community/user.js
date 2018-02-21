const core = require("core");
const axios = require("axios");

module.exports = function GetPlayerSummaries(config, app) {
    if (!app) {
        return;
    }
    app.get(config.address + "/community/user", function (req, res) {
        let query = req.query;

        // See if required query parameters are available
        if (query.key === undefined) {
            res.send("No [auth] key specified!");
            return;
        }
        if (query.id === undefined) {
            res.send("No user [id] specified!");
            return;
        }

        // Check if valid auth key
        core.auth.exists(query.key).then(exists => {
            if (!exists) {
                res.send("Invalid [auth] key, not found in registry!");
            } else {
                // http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=7656119796043553

                axios.get("//api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/", {
                    params: {
                        "key": config.key,
                        "steamids": query.id
                    }
                }).then(response => {
                    res.send(response);
                }).catch(error => {
                    console.log(error);
                    res.send("Server error [Steam | Community | User]");
                });
            }
        });
    });
};