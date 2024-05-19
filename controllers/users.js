const User =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {transporter, generateOTP} = require("../utils/verificationMail.js");
const {getHtml} = require("../utils/emailHTML.js");
const VerificationToken = require("../models/verificationToken.js");

//signup form
module.exports.userSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};



// User signup
module.exports.userSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const OTP = await generateOTP();
        const newUser = new User({
            username,
            email,
            
        });

        const newToken = new VerificationToken({
            owner: newUser._id,
            token:OTP
            
        });

        let user= await User.register(newUser,password);
        await newToken.save();

        var mailOptions = {
            from: process.env.MAILMETRICS_MAIL,
            to: email,
            subject: `Verification of Email`,
            html: getHtml(OTP)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                req.flash("error", "");
            }
        });
        req.flash("success", `OTP is sent at ${email}`);
        res.render("users/emailVerification.ejs",{newUser});
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};
// Email verification
module.exports.emailVerification = async (req, res,next) => {
    try {
        const { id, otp } = req.body;
     
        
        
        const verificationToken = await VerificationToken.findOne({ owner: id });
       const newUser = await User.findById(id);
        if (!verificationToken || verificationToken.token !== otp) {
            req.flash("error", "Invalid OTP. Please try again.");
            return res.render("users/emailVerification.ejs", { newUser });
        }
   
       
        await User.updateOne({ _id: id }, { verified: true });
       
        await VerificationToken.deleteOne({ owner: id });

        req.flash("success", "Email verified successfully!");
        // Redirect the user to the home page or dashboard after successful verification
        req.login(newUser,(err)=>{
            if(err){
              
                return next(err);
                
            }
            req.flash("success","Welcome to MailMetrics");
            res.redirect("/MailMetrics");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

//emailVerificationForm
module.exports.emailVerificationForm = async (req, res, next) => {
    try {
      const { id } = req.body;
        const OTP = await generateOTP();
        console.log("b:",req.body);
        console.log("id:",id);
         
        const newUser= await User.findById(id);

        console.log("user:",newUser);
       await VerificationToken.findOneAndDelete({owner:id});
        const newToken = new VerificationToken({
            owner: newUser._id,
            token:OTP
            
        });

      
        await newToken.save();

        var mailOptions = {
            from: process.env.MAILMETRICS_MAIL,
            to: newUser.email,
            subject: `Verification of Email`,
            html: getHtml(OTP)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                req.flash("error", "");
            }
        });
        req.flash("success", `OTP is sent at ${newUser.email}`);
        res.render("users/emailVerification.ejs",{newUser});
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};



//login form
module.exports.userLoginForm = (req,res)=>{


    res.render("users/login.ejs");
};


//user login
module.exports.userLogin = async(req,res)=>{
    
    req.flash("success","Logined success!");
    let redirectUrl =(res.locals.redirectUrl||"/MailMetrics");
    res.redirect(redirectUrl);
 
 };


//user logout
 module.exports.userLogout = (req,res)=>{
    
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Logout.");
        res.redirect("/MailMetrics");
    });

};