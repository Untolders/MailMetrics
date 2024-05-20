const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const campaignController = require("../controllers/campaign.js");
const { isLoggedIn, isCampaignOwner ,isEmailOwner , validateCampaign, isVerified  } = require("../middleware.js");


router.get("/" ,
isLoggedIn,
isVerified,
wrapAsync(campaignController.index));




router.get("/:id/sendEmail" ,
isLoggedIn,
isVerified,
isEmailOwner,
wrapAsync(campaignController.renderSendEmail));


router.post("/:id/sendEmail" ,
isLoggedIn,
isVerified,
isEmailOwner,
validateCampaign,
wrapAsync(campaignController.sendEmail));



router.get("/analyse/:id" ,
isLoggedIn,
isVerified,
isCampaignOwner,    //error in middleaware donot use it
wrapAsync(campaignController.analyse));


router.get("/analyseByDate/:id", 
isLoggedIn,
isVerified,
isCampaignOwner,   //error in middleaware donot use it
wrapAsync(campaignController.analyseByDate));

router.get("/analyseByMonth/:id", 
isLoggedIn,
isVerified,
isCampaignOwner,  //error in middleaware donot use it
wrapAsync(campaignController.analyseByMonth));

router.get("/analyseByDateInMonth/:id", 
isLoggedIn,
isVerified,
isCampaignOwner,  //error in middleaware donot use it
wrapAsync(campaignController.analyseByDateInMonth));



// saving click triggered
router.get("/:emailId/:subscriberId",

wrapAsync(campaignController.click));


router.get('/open/:campaignId/:subscriberId/tracker.png',

wrapAsync(campaignController.open));




module.exports = router;