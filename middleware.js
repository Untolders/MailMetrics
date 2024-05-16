const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const Listing =require("./models/listings.js");
const Campaign =require("./models/campaign.js");
const { campaignSchema }=require("./schema.js");
// const Review = require("./models/review.js");




module.exports.isLoggedIn =(req,res,next)=>{

    if(!req.isAuthenticated()){
    
       req.session.redirectUrl= req.originalUrl;
        req.flash("error","Login first!");
       return  res.redirect("/login");
       
          }  
            next();
    };


module.exports.saveRedirectUrl=(req,res,next)=>{
 
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();

};

//middleware for validate owner
module.exports.isOwner= async(req,res,next)=>{
  let {id}=req.params;
  let listing = await Listing.findById(id);

  if(!res.locals.currUser._id.equals(listing.owner._id)){
         req.flash("error","You are Owner for this listing !");
         return res.redirect(`/listing/${id}`);
  }

  next();
};

//middleware for validate review Author
module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id, reviewId}=req.params;
  let review = await Review.findById(reviewId);

  if(!res.locals.currUser._id.equals(review.author._id)){
         req.flash("error","You are the Author for this review!");
         return res.redirect(`/listing/${id}`);
  }

  next();
};
//Middleawre For server side Validation of Listings

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    console.log("Validation Error:", errmsg);
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

//Middleawre For server side Validation of Review

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    console.log("Validation Error:", errmsg);
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};



module.exports.validateCampaign = (req, res, next) => {
  const { error } = campaignSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    console.log("Validation Error:", errmsg);
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};