const rp = require("request-promise");
const cheerio = require("cheerio");
const core = require("core");

module.exports = function(config, app) {
    if (!app) {
        return;
    }

    app.get(config.address + "/store/game/categories", (req, res) => {
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
                        return cheerio.load(body);
                    }
                };

                rp(options).then($ => {
                    let categories = [];
                    $("#category_block .game_area_details_specs").each(function (i, elem) {
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
                    res.send(JSON.stringify(categories));
                }).catch(error => {
                    res.send("Server error [Steam | Store | Game | Categories]");
                });
            }
        });
    });
};