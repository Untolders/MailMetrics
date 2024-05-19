if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
  }
  
  
  const express = require("express");
  const app = express();
  const port = 8000;
  const mongoose = require("mongoose");
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate = require('ejs-mate');
  const ExpressError = require("./utils/ExpressError.js");
  const emailRouter = require("./routes/email.js");
  const campaignRouter = require("./routes/campaign.js");
  const subscriberRouter = require("./routes/subscriber.js");
  const Campaign = require("./models/campaign.js");
  const Subscriber = require("./models/subscriber.js");
 const usersRouter = require("./routes/user.js");

  const session = require("express-session");
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user.js");

  
  
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine("ejs", ejsMate);
  app.use(express.static(path.join(__dirname, "/public")));
  
  
  const dbUrl = process.env.ATLASDB_URL;
  
  
  //connecting database
  
  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
  
  
  async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
  
  }
  
  
  async function main() {
    await mongoose.connect(dbUrl);
  }
  
  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
  
  });
  
  store.on("error", () => {
    console.log("MONGO SESSION STORE", err);
  });
  

  const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, // Corrected typo
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    },
};

  
  
  
  app.use(session(sessionOptions));
  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  // use static serialize and deserialize of model for passport session support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  // // local variable
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
  
    next();
  });
  
  
  
  
  
 
  app.use("/MailMetrics/campaigns", campaignRouter);
  app.use("/MailMetrics/subscribers", subscriberRouter);
  app.use("/MailMetrics", emailRouter);

  app.use("/", usersRouter);

  
  
  
  
  
  //default for not found page
  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
  });
  
  
  //if error
  app.use((err, req, res, next) => {
  
    let { statusCode = 500, message = "something went wrong" } = err;
  
    res.render("emails/errorEmail.ejs", { err, statusCode });
  
  });
  
  //if error
  app.use((err, req, res, ) => {
  
  
    console.log(err.name);
    console.log(err.message);
    res.send(`something went wrong  ::ERROR =  ${err.name}`);
  
  
  
  });
  
  
  //connecting server
  app.listen(port, (req, res) => {
    console.log(`You are connected to server ${port}`);
  });