const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.error("Error connecting to the database:", err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '668542f0424d652f87f984b3' }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

initDB();
