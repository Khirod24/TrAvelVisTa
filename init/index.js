const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb+srv://khirod4300dav:o9yW0Hk3fxDV6biL@mongo3.w7azudc.mongodb.net/?retryWrites=true&w=majority"
main().then((res)=>{console.log("db connected succsessfully")})
.catch((err)=>{console.log(err)});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();