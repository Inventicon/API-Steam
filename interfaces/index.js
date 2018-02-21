module.exports = function StartInterfaces(config, app) {
    console.log("Loading Interfaces", config);

    // User API
    require("./community/user")(config, app);
};