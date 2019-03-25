const express = require("express");
const app = express();
const passport = require("passport");
const md5 = require("md5");
const { query } = require("../db");
const requestHelper = require("./requestHelper");
const BBCode = require('node-bbcode')

async function getPlayerInfoFromID(id, mode) {
    let userTable = await query("SELECT * FROM users WHERE id = ?", id);
    let usersStats = await query("SELECT * FROM users_stats WHERE id = ?", id);
    let added = await query("SELECT * FROM users_relationships WHERE user2 = ?", id);
    let followers = 0;
    added.forEach(async user => {  
        followers = followers + 1;
    })
    let userpage = usersStats[0].userpage_content;
    if (!userpage || userpage.length == 0) {
        userpage == ""
    }
    let obj = {
        id: id,
        username: userTable[0].username,
        country: usersStats[0].country,
        location: usersStats[0].customLocation,
        interests: usersStats[0].interests,
        occupation: usersStats[0].worksAs,
        twitter: usersStats[0].twitter,
        discord: usersStats[0].discord,
        skype: usersStats[0].skype,
        site: usersStats[0].site,
        userpage: usersStats[0].userpage_content,
        stats: await getModeStats(id, mode),
        subs: followers,
        joined: userTable[0].register_datetime * 1000,
        lastActivity: userTable[0].latest_activity * 1000,
        bbcode: BBCode.render(userpage, true)
    }
    return obj;
}

async function getModeStats(id, mode) {
    let modedb;
    switch (mode) {
        case 0:
            modedb = "std";
        break;
        case 1:
            modedb = "taiko";
        case 2:
            modedb = "ctb";
        break;
        case 3:
            modedb = "mania";
        break;
        default:
            modedb = "std"
    }
    let request = await requestHelper.request_get("http://awasu.xyz/api/v1/users/full?id="+id);
    let data = request.body;
    if (data.std == undefined) {
        return {
            "ranked_score": 0,
            "total_score": 0,
            "playcount": 0,
            "replays_watched": 0,
            "total_hits": 0,
            "level": 0,
            "accuracy": 0,
            "pp": 0,
            "rank": 0
        }
    }
    let obj;
    if (modedb == "std") {
        obj = {
            "ranked_score": data.std.ranked_score,
            "total_score": data.std.total_score,
            "playcount": data.std.playcount,
            "replays_watched": data.std.replays_watched,
            "total_hits": data.std.total_hits,
            "level": data.std.level,
            "accuracy": data.std.accuracy,
            "pp": data.std.pp,
            "rank": data.std.global_leaderboard_rank
        }
    } else if (modedb == "taiko") {
        obj = {
            "ranked_score": data.taiko.ranked_score,
            "total_score": data.taiko.total_score,
            "playcount": data.taiko.playcount,
            "replays_watched": data.taiko.replays_watched,
            "total_hits": data.taiko.total_hits,
            "level": data.taiko.level,
            "accuracy": data.taiko.accuracy,
            "pp": data.taiko.pp,
            "rank": data.taiko.global_leaderboard_rank
        }
    } else if (modedb == "ctb") {
        obj = {
            "ranked_score": data.ctb.ranked_score,
            "total_score": data.ctb.total_score,
            "playcount": data.ctb.playcount,
            "replays_watched": data.ctb.replays_watched,
            "total_hits": data.ctb.total_hits,
            "level": data.ctb.level,
            "accuracy": data.ctb.accuracy,
            "pp": data.ctb.pp,
            "rank": data.ctb.global_leaderboard_rank
        }
    } else if (modedb == "mania") {
        obj = {
            "ranked_score": data.mania.ranked_score,
            "total_score": data.mania.total_score,
            "playcount": data.mania.playcount,
            "replays_watched": data.mania.replays_watched,
            "total_hits": data.mania.total_hits,
            "level": data.mania.level,
            "accuracy": data.mania.accuracy,
            "pp": data.mania.pp,
            "rank": data.mania.global_leaderboard_rank
        }
    }
    return obj;
}

module.exports = {
    getPlayerInfoFromID
};
