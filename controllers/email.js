const Campaign = require("../models/campaign.js");
const Email =require("../models/email.js");
const { emailSchema }=require("../schema.js");
// const multer  = require('multer');
// const {storage} = require("../cloudConfig.js");
// const upload = multer({ storage });


// index 
module.exports.index=async (req, res,next) => {

  res.render("index.ejs");
  };
  // index 
module.exports.email=async (req, res,next) => {

  // Fetch all listings from the database
  const allemail = await Email.find({});

  // Render the "index.ejs" template with the listings data
  res.render("emails/email.ejs", { allemail });

};

// get add new
module.exports.renderNewForm =(req,res)=>{

    res.render("emails/createEmail.ejs");

 };

//post add new
 module.exports.createEmail =async(req,res,next)=>{
  // let response = await geocodingClient.forwardGeocode({
  //   query: req.body.location,
  //   limit: 1
  // })
  //   .send();
    
    
  // let url=req.file.path;
  // let filename=req.file.filename;
  const newEmail = new Email(req.body);
  
   
  
  // newListing.owner = req.user._id;
  // newListing.image={url,filename};
  // newListing.geometry=response.body.features[0].geometry;
  await newEmail.save();
  req.flash("success","New Email Saved!");
   
   res.redirect( "/MailMetrics") ;

 

};

// show
module.exports.showEmail = async(req,res,next)=>{

  let {id} =req.params;

  const email = await Email.findById(id);
  
  if(!email){
    req.flash("error","Not Exist!");
    res.redirect("/MailMetrics");
  }

  res.render("emails/showEmail.ejs",{email});

};

//get edit form
module.exports.renderEditForm = async (req,res,next)=>{
  
  let {id} =req.params;

  const email = await Email.findById(id);
  if(!email){
    req.flash("error","Not Exist!");
    res.redirect("/MailMetrics");
  }

  res.render("emails/editEmail.ejs",{email});
};

// post edit listing
module.exports.editEmail = async (req,res,next)=>{
  // let response = await geocodingClient.forwardGeocode({
  //   query: req.body.location,
  //   limit: 1
  // })
  //   .send();
    

  let {id} =req.params;
  
 
  let email = await Email.findByIdAndUpdate(id , {...req.body})
 
  let campaign = await Campaign.find({ emailId: email._id });


      await email.save();
    console.log("updated");
    req.flash("success","Email Updated!");
    res.redirect(`/MailMetrics/${id}`);
 
  };

//destroy listing 
  module.exports.destroyEmail = async(req,res,next)=>{

    let {id} =req.params;
  
    const email = await Email.findByIdAndDelete(id);
    console.log("deleted successfully");
    req.flash("success","Email Deleted!");
    res.redirect("/MailMetrics");
  
  };


  //Sending Email
//get /send
  module.exports.send = async(req,res,next)=>{

  
    res.redirect("/campaigns/sendEmail");
  
  };
  