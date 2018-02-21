module.exports = function StartInterfaces(config, app) {
    console.log("Loading Interfaces");

    // Community APIs
    {
        // User API
        require("./community/user")(config, app);
    }

    // Store APIs
    {
        // Game APIs
        {
            require("./store/game/categories")(config, app);
        }
    }
};