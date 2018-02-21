const core = require("core");

module.exports = function GetPlayerSummaries(config, app) {
    this.app = app;
    if (!app) {
        return;
    }
    this.app.get(config.address + "/community/user", function (req, res) {
        let query = req.query;

        // See if required query parameters are available
        if (query.auth === undefined) {
            res.send("No [auth] key specified!");
        }
        if (query.id === undefined) {
            res.send("No user [id] specified!");
        }

        // Check if valid auth key
        if (!core.auth.validAuth(query.auth)) {
            res.send("Invalid [auth] key, not found in registry!");
        }

        res.send("It works!");
    })
};