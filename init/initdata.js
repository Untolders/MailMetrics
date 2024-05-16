const mongoose = require("mongoose");
const subscribers = require("./subscribersData.js");
const Subscriber = require("../models/subscriber.js");

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
  await Subscriber.deleteMany({});
// for(let subscriber of subscribers){
//   console.log(subscriber);
  await Subscriber.insertMany(subscribers);
// }
  console.log("data was initialized");
};

initDB();