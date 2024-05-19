const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

const {isVerified } = require("../middleware.js");

//signup form
router.route("/signup")
.get(userController.userSignupForm)


//user sign-up
.post( wrapAsync(userController.userSignup));


//email-verification form
router.route("/signup/emailVerification")


//user email verification
.post( wrapAsync(userController.emailVerification));
router.route("/signup/emailVerificationForm")
.post(userController.emailVerificationForm)

//login form
router.route("/login")
.get(userController.userLoginForm)
//user login
.post(
saveRedirectUrl,
passport.authenticate('local',
 { failureRedirect: '/login'
 ,failureFlash:true}),
 isVerified,
 wrapAsync(userController.userLogin)
);


//user logout
router.get("/logout",userController.userLogout);

module.exports= router;