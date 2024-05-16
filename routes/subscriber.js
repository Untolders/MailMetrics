const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const {isLoggedIn} = require("../middleware.js");
// const { isOwner ,validateListing  } = require("../middleware.js");
const subscriberController = require("../controllers/subscriber.js");


  
//listing route
router.get("/",wrapAsync(subscriberController.index));


//new listing route
router.route("/addSubscriber")
.get(
  // isLoggedIn,
  subscriberController.renderNewForm)
//adding new listing
.post(
  // isLoggedIn,
  
  // validateListing,
   wrapAsync(subscriberController.addSubscriber));


//route for editing listing
router.get("/:id/update" ,
// isLoggedIn,
// isOwner,
 wrapAsync(subscriberController.renderUpdateForm));
 
 router.post("/:id/update" ,
// isLoggedIn,
// isOwner,
 wrapAsync(subscriberController.updateSubscriber));


// Delete route
router.get("/:id/delete" ,
// isLoggedIn,
// isOwner,
wrapAsync(subscriberController.deleteSubscriber));






module.exports = router;


