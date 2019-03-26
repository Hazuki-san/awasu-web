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
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await playerHelper.getPlayerInfoFromID(userId)
    }
    let id;
    let isId = await query("SELECT * FROM users WHERE id = ?", req.params.id)
    if (isId.length < 1) {
        let idQuery = await query("SELECT * FROM users WHERE username = ?", req.params.id);
        if (idQuery.length < 1) {
            res.render("base", {
                page: "404",
                loggedIn: req.isAuthenticated(),
                userid: userId,
                userData: currentUser
            });
            return
        }
        id = idQuery[0].id
    } else {
        id = req.params.id
    }

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
    let usersData = await playerHelper.getPlayerInfoFromID(id, mode)
    if (!usersData) {
        res.render("base", {
            page: "404",
            loggedIn: req.isAuthenticated(),
            userid: userId,
            userData: currentUser
        });
    }
	let friend = await query("SELECT * FROM users_relationships WHERE user1 = ? AND user2 = ?", id, userId);
	let isFriend = false;
	if (friend.length > 0) {
		let userfriend = await query("SELECT * FROM users_relationships WHERE user1 = ? AND user2 = ?", userId, id);
		if (userfriend.length > 0) {
			isFriend = true;
		}
	}
	let request = await requestHelper.request_get("http://awasu.xyz/api/v1/users/scores/best?id="+id+"&mode="+mode);
    let topScores = JSON.parse(request.body);
    let requestRecent = await requestHelper.request_get("http://awasu.xyz/api/v1/users/scores/recent?id="+id+"&mode="+mode);
    let recentScores = JSON.parse(requestRecent.body);

    res.render("base", {
        page: "Userpage",
        loggedIn: req.isAuthenticated(),
        userid: userId,
        userData: currentUser,
        userCount: registeredUsers,
        scoreCount: submittedScores,
        mapCount: mapCount,
        profileData: usersData,
        playMode: mode,
        added: isFriend,
        topScores: topScores,
        recentScores: recentScores
    });
}

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

module.exports = handle;