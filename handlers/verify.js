const express = require("express");
const app = express();
const passwordHelper = require("../utils/passwordHelper");
const md5 = require("md5")
const { query } = require("../db")
const passport = require("passport")

app.get("/verify", async (req, res) => {
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await playerHelper.getPlayerInfoFromID(userId)
    }
    res.render("base", {
        page: "Verify",
        loggedIn: req.isAuthenticated(),
        userid: userId,
        userData: currentUser,
    });
})
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

module.exports = app;