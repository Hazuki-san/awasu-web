const express = require("express");
const app = express();
const md5 = require("md5");
const { query } = require("../db");
const passwordHelper = require("../utils/passwordHelper")
const passport = require("passport")
const bcrypt = require("bcrypt")

app.get("/register", async (req, res) => {
    if (req.user) {
        return res.redirect("/")
    }
    res.render("base", {
        page: "Register",
        loggedIn: req.isAuthenticated(),
        userid: 0,
        userData: ""
    });
})

app.post("/register", async (req, res) => {
    let username = req.body.username;
    let password = await md5(req.body.password[0]);
    let email = req.body.email;
    if (req.body.password[0] != req.body.password[1]) {
        res.redirect("/register?e=passwordErr");
        return;
    }
    if (username == "" || req.body.password[0] == "" || req.body.password[1] == "" || email == "") {
        res.redirect("/register?e=notAllFilled")
        return;
    }
    bcrypt.hash(password, 10, async function(err, hash) {

    let usernameSafe = username.toLowerCase().replace(" ", "_");
    let unixTime = Math.floor(new Date().getTime() / 1000)
    
    let userNameTest = await query("SELECT * FROM users WHERE username = ?", username);
    let emailTest = await query("SELECT * FROM users WHERE email = ?", email);
    if (userNameTest.length > 0 || emailTest.length > 0) {
        res.redirect("/register?e=alreadyRegistered");
        return;
    }
    console.log(email)
    await query("INSERT INTO users(username, username_safe, password_md5, salt, email, register_datetime, privileges, password_version) VALUES(?,?,?,'',?,?,?,2)", username, usernameSafe, hash, email, unixTime, 1048576)
    await query("INSERT INTO users_stats(username, user_color, user_style, ranked_score_std, playcount_std, total_score_std, ranked_score_taiko, playcount_taiko, total_score_taiko, ranked_score_ctb, playcount_ctb, total_score_ctb, ranked_score_mania, playcount_mania, total_score_mania) VALUES (?, 'black', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);", username);
    res.redirect("/verification");
    res.end();
    });
})

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

module.exports = app;