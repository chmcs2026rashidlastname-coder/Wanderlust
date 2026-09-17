const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User=require("../models/user.js");



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  //await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"6aaa463b2806c6ad51626253",}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();