const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isEmailOwner, validateEmail, isVerified } = require("../middleware.js");
const emailController = require("../controllers/email.js");

// Listing route
router.get("/", isLoggedIn,isVerified, wrapAsync(emailController.index));

router.get("/email", isLoggedIn,isVerified, wrapAsync(emailController.email));

// New listing route
router.get("/createEmail", isLoggedIn,isVerified, emailController.renderNewForm);

// Adding new listing
router.post("/createEmail", isLoggedIn,isVerified, validateEmail, wrapAsync(emailController.createEmail));

// Route for editing listing
router.get("/edit/:id", isLoggedIn, isVerified, isEmailOwner, wrapAsync(emailController.renderEmailEditForm));

// Editing listing
router.put("/edit/:id", isLoggedIn,isVerified,  isEmailOwner, validateEmail, wrapAsync(emailController.editEmail));

// Delete route
router.get("/delete/:id", isLoggedIn,isVerified,  isEmailOwner, wrapAsync(emailController.destroyEmail));

// Show route
router.get("/:id", isLoggedIn,isVerified,  wrapAsync(emailController.showEmail));

module.exports = router;
