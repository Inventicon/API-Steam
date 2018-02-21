module.exports = function StartInterfaces(config, app) {
    console.log("Loading Interfaces");

    // Community APIs
    {
        // User API
        require("./community/user")(config, app);
    }
};