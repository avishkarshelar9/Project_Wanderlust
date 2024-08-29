const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connection succesful")
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongoUrl);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"66bd280268809471d97100fe"}));
    await Listing.insertMany(initData.data);
    console.log("Data is intilized");
}

initDB();