const express = require("express");
const app = express();
const md5 = require("md5");
const { query } = require("../db");
const playerHelper = require("../utils/playerHelper");
const passport = require("passport");

app.get("/home/account/edit", async (req, res) => {
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
    } else {
        res.redirect("/");
    }
    res.render("base", {
        page: "Settings",
        loggedIn: req.isAuthenticated(),
        userid: userId,
        userData: currentUser,
        userCount: registeredUsers,
        scoreCount: submittedScores,
        mapCount: mapCount
    })
})

app.post("/userStatsUpdate", async (req, res) => {
    if (!req.user) {
        res.redirect("/")
    }
    
    await query("UPDATE users_stats SET customLocation = ?, interests = ?, worksAs = ?, twitter = ?, discord = ?, skype = ?, site = ? WHERE id = ?", req.body.location, req.body.interests, req.body.occupation, req.body.twitter, req.body.discord, req.body.skype, req.body.website, req.user);

    res.redirect("/home/account/edit");
})

app.post("/userpage", async (req, res) => {
    if (!req.user) {
        res.redirect("/")
    }

    await query("UPDATE users_stats SET userpage_content = ? where id = ?", req.body.userpage, req.user);
    res.redirect("/home/account/edit");
})
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});
module.exports = app;