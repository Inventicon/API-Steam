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
                let ids = query.id.split(",");
                ids = ids.map(async (id) => {
                    return core.find.user64(config.key, id);
                });

                Promise.all(ids).then(id64s => {
                    let steamids = id64s.join(",");
                    axios.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/", {
                        params: {
                            "key": config.key,
                            "steamids": steamids
                        }
                    }).then(response => {
                        console.log(response.data.response.players);
                        res.send(response.data.response.players);
                    }).catch(error => {
                        console.log(error);
                        res.send("Server error [Steam | Community | User]");
                    });
                });
            }
        });
    });
};