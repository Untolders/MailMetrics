const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const Campaign =require("./models/campaign.js");
const Email = require("./models/email.js");
const Subscriber = require("./models/subscriber.js");
const { campaignSchema,emailValidationSchema, subscriberValidationSchema, senderEmailValidationSchema }=require("./schema.js");
const { email } = require("./controllers/email.js");






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
module.exports.isCampaignOwner= async(req,res,next)=>{
 try{
  let {id}=req.params;
  
  
  let campaign= await Campaign.findById(id);
 

  if(!res.locals.currUser._id.equals(campaign.owner._id)){
         req.flash("error","You are Owner for this Campaign !");
         return res.redirect(`/MailMetrics/campaigns`);
  }

  next();
} catch (error) {
  console.error("Error in isCampaignOwner middleware:", error);
  req.flash("error", "An error occurred while checking ownership!");
  return res.redirect(`/MailMetrics/campaigns`);
}
};

//middleware for validate review Author
module.exports.isEmailOwner= async(req,res,next)=>{
  try{
  let {id}=req.params;
  
  
  let email = await Email.findById(id);



  if(!res.locals.currUser._id.equals(email.owner._id)){
         req.flash("error","You are the not Owner for this email!");
         return res.redirect(`/MailMetrics/email`);
  }

  next();
} catch (error) {
  console.error("Error in isEmailOwner middleware:", error);
  req.flash("error", "An error occurred while checking ownership!");
  return res.redirect(`/MailMetrics/email`);
}
};

module.exports.isSubscrierOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let subscriber = await Subscriber.findById(id);
    
    

    if (!(res.locals.currUser._id.equals(subscriber.owner._id))) {
      req.flash("error", "You are not the owner of this subscriber list!");
      return res.redirect(`/MailMetrics/subscribers`);
    }

    next();
  } catch (error) {
    console.error("Error in isSubscrierOwner middleware:", error);
    req.flash("error", "An error occurred while checking ownership!");
    return res.redirect(`/MailMetrics/subscribers`);
  }
};



//Middleawre For server side Validation of Listings

module.exports.validateEmail = (req, res, next) => {
 
  try{
  const { error } = emailValidationSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    req.flash("error", "Validation Error:",error.message);
    console.log("Validation Error:", error.message);
    return res.redirect(`/MailMetrics/email`);
    
  } else {
    next();
  }
} catch (error) {
  console.error("Error in Validation middleware:", error);
  req.flash("error",error.message);
  return res.redirect(`/MailMetrics/email`);
}

};

//Middleawre For server side Validation of Review

module.exports.validateCampaign = (req, res, next) => {
  const { error } = campaignSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    console.log("Validation Error:", errmsg);
    req.flash("error", "Validation Error:",error.message);
    res.redirect("/MailMetrics/campaigns");
    
  } else {
    next();
  }
};



module.exports.validateSubscriber = (req, res, next) => {
  try {
    const { error } = subscriberValidationSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      console.log("Validation Error:", errmsg);
      
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in Validation middleware:", error);
    req.flash("error", error.message);
    res.redirect("/MailMetrics/subscribers");
  }
};

module.exports.validateSenderEmail = (req, res, next) => {
  try {
    const { error } = senderEmailValidationSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      console.log("Validation Error:", errmsg);
      // Handle validation error here
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in Validation middleware:", error);
    req.flash("error", "Validation error: ",error.message);
    res.redirect("/addSenderEmail");
  }
};




// isVerified middleware
module.exports.isVerified = (req, res, next) => {
  // Assuming the user object is attached to req.user during authentication
  const newUser = req.user;

  // Check if user is verified
  if (newUser && newUser.verified) {
      // User is verified, proceed to the next middleware
      next();
  } else {
      // User is not verified, redirect to a page indicating the user needs to verify their email
    //  req.flash("error", "Please verify your email first!");
      res.render("users/emailVerificationForm.ejs",{newUser}); // Adjust the redirect URL as needed
  }
};

