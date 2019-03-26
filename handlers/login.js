const express = require("express");
const app = express();
const passwordHelper = require("../utils/passwordHelper");
const md5 = require("md5")
const { query } = require("../db")
const passport = require("passport")

app.get("/login", async (req, res) => {
    if (req.user) {
        return res.redirect("/")
    }
    res.render("base", {
        page: "Login",
        loggedIn: req.isAuthenticated(),
        userid: 0,
        userData: ""
    });
})

app.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = md5(req.body.password);
    let q = await query("SELECT * FROM users WHERE username = ?", username);
    if (q.length < 1) {
        res.redirect("/login");
    }
    if (q[0].privileges == 1048576) {
        res.redirect("/verification")
    }
    let passwordCheck = passwordHelper.checkPassword(password, q[0].password_md5);
    if (!passwordCheck) {
        res.redirect("/login");
    } else {
        let uid = q[0].id
        req.login(uid, function () {
            res.redirect("/");
        });
    }
})
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});


module.exports = app;