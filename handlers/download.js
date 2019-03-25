const { query } = require("../db");
const playerHelper = require("../utils/playerHelper");
const passport = require("passport");

async function handle(req, res) {
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await playerHelper.getPlayerInfoFromID(userId)
    }
    res.render("base", {
        page: "Download",
        loggedIn: req.isAuthenticated(),
        userid: userId,
        userData: currentUser,
    });
}

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

module.exports = handle;