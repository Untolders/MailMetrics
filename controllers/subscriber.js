const Subscriber =require("../models/subscriber.js");
const { subscriberSchema }=require("../schema.js");



// index 
module.exports.index=async (req, res,next) => {

    // Fetch all listings from the database
   
    
    const allsubscriber = await Subscriber.find({});
  
    // Render the "index.ejs" template with the listings data
    res.render("subscribers/subscribers.ejs", { allsubscriber });

  };

// get add new
module.exports.renderNewForm =(req,res)=>{

    res.render("subscribers/addSubscriber.ejs");

 };

//post add new
 module.exports.addSubscriber =async(req,res,next)=>{

  const newSubscriber = new Subscriber(req.body);
  
 
  await newSubscriber.save();
  req.flash("success","New Subscriber Saved!");
   console.log("ADDED!");
   res.redirect( "/MailMetrics/subscribers") ;

 

};

//get edit form
module.exports.renderUpdateForm = async (req,res,next)=>{
  
  let {id} =req.params;

  const subscriber = await Subscriber.findById(id);
  if(!subscriber){
    req.flash("error","Not Exist!");
    res.redirect("/MailMetrics/subscribers");
  }

  res.render("subscribers/updateSubscriber.ejs",{subscriber});
};

// post edit listing
module.exports.updateSubscriber = async (req,res,next)=>{
 
    

  let {id} =req.params;
  
 
  let subscribe = await Subscriber.findByIdAndUpdate(id , {...req.body})
 
 
      await subscribe.save();
    console.log("updated");
    req.flash("success","Subscriber Updated!");
    res.redirect(`/MailMetrics/subscribers`);
 
  };

//destroy subscriber
  module.exports.deleteSubscriber = async(req,res,next)=>{

    let {id} =req.params;
  
    const subscribe = await Subscriber.findByIdAndDelete(id);
    console.log("deleted successfully");
    req.flash("success","subscriber Deleted!");
    res.redirect("/MailMetrics/subscribers");
  
  };

