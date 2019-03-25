const { query } = require("../db");
const playerHelper = require("../utils/playerHelper");
const passport = require("passport");

async function handle(req, res) {
    let registeredUsers = await query("SELECT count(id) as userCount FROM users");
    registeredUsers = registeredUsers[0].userCount;
    let submittedScores = await query("SELECT count(id) as scoreCount FROM scores");
    submittedScores = submittedScores[0].scoreCount;
    let mapCount = await query("SELECT count(id) as mapCount FROM beatmaps");
    mapCount = mapCount[0].mapCount;
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await playerHelper.getPlayerInfoFromID(userId)
    }
    res.render("base", {
        page: "Home",
        loggedIn: req.isAuthenticated(),
        userid: userId,
        userData: currentUser,
        userCount: registeredUsers,
        scoreCount: submittedScores,
        mapCount: mapCount
    });
}

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

module.exports = handle;