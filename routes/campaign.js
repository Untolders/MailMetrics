const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const campaignController = require("../controllers/campaign.js");
// const {isLoggedIn} = require("../middleware.js");
// const { isOwner ,validateListing  } = require("../middleware.js");
// const {  validateCampaign  } = require("../middleware.js");

router.get("/" ,
// isLoggedIn,
// isOwner,
wrapAsync(campaignController.index));




router.get("/:id/sendEmail" ,
// isLoggedIn,
// isOwner,
wrapAsync(campaignController.renderSendEmail));


router.post("/:id/sendEmail" ,
// isLoggedIn,
// isOwner,
// validateCampaign,
wrapAsync(campaignController.sendEmail));


router.get("/analyse/:id" ,
// isLoggedIn,
// isOwner,
wrapAsync(campaignController.analyse));


router.get("/analyseByDate/:id", 
wrapAsync(campaignController.analyseByDate));




// saving click triggered
router.get("/:emailId/:subscriberId",

wrapAsync(campaignController.click));


router.get('/open/:campaignId/:subscriberId/tracker.png',

wrapAsync(campaignController.open));




module.exports = router;