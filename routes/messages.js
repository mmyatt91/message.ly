const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const Message = require("../models/messages"); 
const { ensuredLoggedIn } = require("../middleware/auth")

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensuredLoggedIn, async function(req, res, next) {
    try{
        const username = req.user.username; 
        const msg = req.params.id;
        
        if (msg.from_username.username !== username && msg.to_username.username !== username){
            throw new ExpressError(`You cannot read this message`, 401)
        }
        return res.json({message: msg})
     }
     catch(err){
         return next(err)
     }
 });


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensuredLoggedIn, async function(req, res, next){
    try{
        const msg = await Message.create({
            from_username = req.user.username,
            to_username = req.body.to_username,
            body: req.body.body
        });
        return res.json({message: msg})
    } catch(err){
        return next(err)
    }
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensuredLoggedIn, async function(req, res, next){
    try{
        const user = req.user.username,
        const msg = await Message.get(req.params.id); 

        if(msg.to_user.username !== username){
            throw new ExpressError(`Not authorized to change Message status`, 401)
        }
        const readMsg =  await Message.markRead(req.params.id)
        return res.json({readMsg})
    } catch(err){
        return next(err)
    }
})

