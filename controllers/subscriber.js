const Subscriber =require("../models/subscriber.js");




// index 
module.exports.index=async (req, res,next) => {

    // Fetch all listings from the database
   
    const user = req.user;
    const allsubscriber = await Subscriber.find({owner:user._id});
  
    // Render the "index.ejs" template with the listings data
    res.render("subscribers/subscribers.ejs", { allsubscriber });

  };

// get add new
module.exports.renderNewForm =(req,res)=>{

    res.render("subscribers/addSubscriber.ejs");

 };

//post add new
 module.exports.addSubscriber =async(req,res,next)=>{


   try {
 

    // Create a new subscriber
    const { username, email, age } = req.body;
    const newSubscriber = new Subscriber({
        username,
        email,
        age,
        owner: req.user._id
    });

    await newSubscriber.save();

    req.flash("success", "Successfully subscribed!");
    res.redirect("/MailMetrics/subscribers");
} catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        req.flash("error", "You have already the subscriber with this email.");
    } else {
        req.flash("error", err.message);
      
    }
    res.redirect("/MailMetrics/subscribers");
}

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

