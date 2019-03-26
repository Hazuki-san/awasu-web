const { query } = require("../db");
const playerHelper = require("../utils/playerHelper");
const passport = require("passport");
const requestHelper = require("../utils/requestHelper");

async function handle(req, res) {
    let registeredUsers = await query("SELECT count(id) as userCount FROM users");
    registeredUsers = registeredUsers[0].userCount;
    let submittedScores = await query("SELECT count(id) as scoreCount FROM scores");
    submittedScores = submittedScores[0].scoreCount;
    let mapCount = await query("SELECT count(id) as mapCount FROM beatmaps");
    mapCount = mapCount[0].mapCount;
    let mode; 
    switch (req.query.m) {
    	case 0:
    		mode = 0;
    	break;
    	case 1:
    		mode = 1;
    	break;
    	case 2:
    		mode = 2;
    	break;
    	case 3:
    		mode = 3;
    	break;
    	default:
    		mode = 0;
    }
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await playerHelper.getPlayerInfoFromID(userId)
    }
    let request = await requestHelper.request_get("http://awasu.xyz/api/v1/leaderboard?mode="+mode);
    let leaderboardData = JSON.parse(request.body);
    if (leaderboardData.users == null) {
        leaderboardData.users = []
    }
    res.render("base", {
        page: "Leaderboard",
        loggedIn: req.isAuthenticated(),
        userid: userId,
        userData: currentUser,
        userLeaderboard: leaderboardData.users,
        mode: mode,
        userCount: registeredUsers,
        scoreCount: submittedScores,
        mapCount: mapCount
    });
}

module.exports = handle;