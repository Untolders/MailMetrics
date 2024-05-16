const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const {isLoggedIn} = require("../middleware.js");
// const { isOwner ,validateListing  } = require("../middleware.js");
const emailController = require("../controllers/email.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

  
//listing route
router.get("/",wrapAsync(emailController.index));

router.get("/email",wrapAsync(emailController.email));
//new listing route
router.route("/createEmail")
.get(
  // isLoggedIn,
  emailController.renderNewForm)
//adding new listing
.post(
  // isLoggedIn,
  
  // validateListing,
   wrapAsync(emailController.createEmail));


//Show route
router
.route("/:id")
.get(wrapAsync(emailController.showEmail))
//Editing listing
.put(
  // isLoggedIn,
  // isOwner,
  // upload.single('image'),
  // validateListing,
   wrapAsync(emailController.editEmail));


//route for editing listing
router.get("/:id/edit" ,
// isLoggedIn,
// isOwner,
 wrapAsync(emailController.renderEditForm));


// Delete route
router.get("/:id/delete" ,
// isLoggedIn,
// isOwner,
wrapAsync(emailController.destroyEmail));






module.exports = router;


