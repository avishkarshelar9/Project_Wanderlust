const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

//show signup 
router.get("/signup",(userController.signup));

//post signup
router.post("/signup", wrapAsync (userController.signupPost));

//show login
router.get("/login",(userController.loginShow));

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect :"/login",failureFlash:true}),(userController.login));

router.get("/logout", (userController.logout));

module.exports =  router;

