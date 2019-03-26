const { query } = require("../db");
const playerHelper = require("../utils/playerHelper");
const passport = require("passport");
const requestHelper = require("../utils/requestHelper");

async function handle(req, res) {
    let mode; 
    switch (req.params.m) {
    	case "osu/performance":
    		mode = 0;
    	break;
    	case "taiko/performance":
    		mode = 1;
    	break;
    	case "fruits/performance":
    		mode = 2;
    	break;
    	case "mania/performance":
    		mode = 3;
    	break;
    	default:
    		mode = 0;
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
        mode: mode
    });
}

module.exports = handle;