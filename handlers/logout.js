const express = require("express");
const app = express();
const passwordHelper = require("../utils/passwordHelper");
const md5 = require("md5")
const { query } = require("../db")
const passport = require("passport")

app.get("/logout", async (req, res) => {
    let uid = req.user;
    req.logout(uid);
    res.redirect("/")
})
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

module.exports = app;