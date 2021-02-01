const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const User = require("../models/users"); 
const { ensuredLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { DB_URI } = require("../config");
const { user } = require("../db");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async function(req, res, next){
    try{
        const results = await User.all();
        return res.json({results})
    } catch(err){
        return next(err)
    }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureCorrectUser, async function(req, res, next){
    try{
        const result = await User.get(req.params.username)
        return res.json({result})
    } catch(err){
        return next(err)
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async function(req, res, next){
    try{
        const toMsgs = await User.messagesTo(req.params.username)
        return res.json({toMsgs})
    } catch(err){
        return next(err)
    }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureCorrectUser, async function(req, res, next){
    try{
        const frmMsgs = await User.messagesFrom(req.params.username)
        return res.json({frmMsgs})
    } catch(err){
        return next(err)
    }
})