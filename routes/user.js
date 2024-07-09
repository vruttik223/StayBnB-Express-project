const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const{ saveRedirectUrl }=require("../middleware.js");
const userController=require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);

router.post(
  "/signup",saveRedirectUrl,
  wrapasync(userController.signup)
);

router.get("/login",userController.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
