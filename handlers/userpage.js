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
	let usersData = await playerHelper.getPlayerInfoFromID(req.params.id, mode)
	let friend = await query("SELECT * FROM users_relationships WHERE user1 = ? AND user2 = ?", req.params.id, userId);
	let isFriend = false;
	if (friend.length > 0) {
		let userfriend = await query("SELECT * FROM users_relationships WHERE user1 = ? AND user2 = ?", userId, req.params.id);
		if (userfriend.length > 0) {
			isFriend = true;
		}
	}
	let topScores = await query("SELECT pp, accuracy, song_name, beatmap_id, scores.id  FROM scores INNER JOIN beatmaps ON scores.beatmap_md5 = beatmaps.beatmap_md5 WHERE completed = 3 AND userid = ? ORDER BY pp DESC", req.params.id);
	let recentScores = await query("SELECT pp, accuracy, song_name, beatmap_id, scores.id  FROM scores INNER JOIN beatmaps ON scores.beatmap_md5 = beatmaps.beatmap_md5 WHERE userid = ? ORDER BY time DESC", req.params.id)
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