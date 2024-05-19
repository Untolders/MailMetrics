const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn,  validateSubscriber, isSubscrierOwner , isVerified } = require("../middleware.js");
const subscriberController = require("../controllers/subscriber.js");


  
//listing route
router.get("/",
isLoggedIn,
isVerified,
wrapAsync(subscriberController.index));


//new listing route
router.route("/addSubscriber")
.get(
  isLoggedIn,
  isVerified,
  (subscriberController.renderNewForm))
//adding new listing
.post(
  isLoggedIn,
  isVerified,
   validateSubscriber,
   wrapAsync(subscriberController.addSubscriber));


//route for editing listing

router.get("/:id/update" ,
isLoggedIn,
isVerified,
isSubscrierOwner,
 (subscriberController.renderUpdateForm));
 
 router.post("/:id/update" ,
isLoggedIn,
isVerified,
isSubscrierOwner,
validateSubscriber,
 wrapAsync(subscriberController.updateSubscriber));


// Delete route
router.get("/:id/delete" ,
isLoggedIn,
isVerified,
isSubscrierOwner,
wrapAsync(subscriberController.deleteSubscriber));






module.exports = router;


