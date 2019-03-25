const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const config = require("./config.json")
const path = require("path");

app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passport = require('passport')
app.use(cookieParser());

app.use(session({
    secret: config.site.secret,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());


app.get("/", require("./handlers/homepage"))
app.get("/home/friends", require("./handlers/friends"))
app.use(require("./handlers/login"))
app.use(require("./handlers/register"))
app.use(require("./handlers/settings"))
app.use(require("./handlers/logout"))
app.get("/users/:id", require("./handlers/userpage"));

app.listen(config.site.port);
