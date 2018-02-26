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

                core.cache.features.getFeatures(appid).then(features => {
                    let useCache = true;
                    if (features !== undefined && useCache) {
                        console.log("Getting features from cache");
                        res.send(features);
                    } else {
                        console.log("Fetch features");

                        const options = {
                            uri: ("http://store.steampowered.com/app/" + appid),
                            transform: function (body) {
                                return cheerio.load(body);
                            }
                        };

                        rp(options).then($ => {
                            let categories = [];
                            let features = $("#category_block").find(".game_area_details_specs");
                            features.each(function (i, elem) {
                                let categoryName = $(this).find(".name").text();
                                let categoryIcon = $(this).find(".icon a img").attr("src");
                                let categoryUrl = $(this).find(".name").attr("href");
                                let categoryJson = {
                                    name: categoryName,
                                    icon: categoryIcon,
                                    url: categoryUrl
                                };
                                core.cache.features.cacheFeature(appid, categoryName, categoryIcon, categoryUrl);
                                categories.push(categoryJson);
                            });
                            categories.push("success");
                            res.send(JSON.stringify(categories));
                        }).catch(error => {
                            res.send("Server error [Steam | Store | Game | Categories]");
                        });
                    }
                });
            }
        });
    });
};