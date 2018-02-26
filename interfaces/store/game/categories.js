const rp = require("request-promise");
const cheerio = require("cheerio");
const core = require("core");

module.exports = function(config, app) {
    if (!app) {
        return;
    }

    // GameFeatures (Scraper)
    console.log("Loading Endpoint: Game Features - [Store, Game, Categories]");
    app.get(config.address + "/store/game/features", (req, res) => {
        let query = req.query;

        let appid = query.appid;
        if (appid === undefined) {
            res.send("No [appid] provided!");
            return;
        }

        if (query.key === undefined) {
            res.send("No [auth] key specified!");
            return;
        }

        core.auth.exists(query.key).then(exists => {
            if (!exists) {
                res.send("Invalid [auth] key, not found in registry!");
            } else {
                const options = {
                    uri: ("http://store.steampowered.com/app/" + appid),
                    transform: function (body) {
                        console.log(body);
                        return cheerio.load(body);
                    }
                };

                rp(options).then($ => {
                    console.log($);
                    let categories = [];
                    let features = $("#category_block").find(".game_area_details_specs");
                    features.each(function (i, elem) {
                        let categoryName = $(this).find(".name").text();
                        let categoryicon = $(this).find(".icon a img").attr("src");
                        let categoryUrl = $(this).find(".name").attr("href");
                        let categoryJson = {
                            name: categoryName,
                            icon: categoryicon,
                            url: categoryUrl
                        };
                        categories.push(categoryJson);
                    });
                    categories.push("success");
                    res.send(JSON.stringify(categories));
                }).catch(error => {
                    res.send("Server error [Steam | Store | Game | Categories]");
                });
            }
        });
    });
};