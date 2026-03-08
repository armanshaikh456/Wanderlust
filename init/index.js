// const mongoose = require("mongoose");
const initData = require("./data.js")
const {MongoClient} = require("mongodb")
// const Listing = require("../models/listing")

// import { MongoClient } from "mongodb";

const uri = `mongodb+srv://delta-student:KxzhacXm2wonqZOk@cluster0.oebait5.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri);



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
// main()
//     .then((res) => console.log("connected to DB"))
//     .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

const initDB = async () => {
  try {
    await client.connect();
    const database = client.db("test");
    const listing = database.collection("listings");
    await listing.deleteMany({});
    let Data = initData.data.map((obj) => ({ ...obj, owner:  '69ac656406f89b6db7caed12'}));
    const result = await listing.insertMany(Data);
    console.log("document inserted");
    // await Listing.deleteMany({});
    // await Listing.insertMany(Data);
    // console.log("data was initialized");
    // const listing = await Listing.find();
    // console.log(listing);
  } catch (e) {
    console.log(e)
  } finally{
    client.close();
  }

}
initDB()