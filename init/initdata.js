const mongoose = require("mongoose");
const subscribers = require("./subscribersData.js");
const Subscriber = require("../models/subscriber.js");
const fakeEmails = require("./emaildata.js");
const Email = require("../models/email.js");
const fakeCampaigns = require("./campaigndata.js");
const Campaign = require("../models/campaign.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/MailMetrics";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

  // await Subscriber.insertMany(subscribers);

  // await Email.insertMany(fakeEmails);

  await Campaign.insertMany(fakeCampaigns);
  console.log("data was initialized");
};

initDB();