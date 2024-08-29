const { query } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:  mapToken });

//index
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs",{ allListings });
 }


//Add new 
module.exports.new =(req,res)=>{
    res.render("listings/new.ejs");
 }

//show route
module.exports.show = (async (req,res)=>{
    let { id } = req.params;
    let list  = await Listing.findById(id).
    populate({
     path: 'reviews', // Populates the reviews field
     populate: {
         path: 'author', // Populates the author field within reviews
         model: 'User'   //  matches User model
     }
 }).populate("owner"); 
 
    if(!list){
         req.flash("error","Listing You requested Does not Exist!")
         res.redirect("/listings")
    }
 
    console.log(list);
    res.render("listings/show.ejs",{ list });
 })

//create Route 
module.exports.create = ( async (req,res,next)=>{
    
    //let {title,description,image,price,location,country}= req.body; old syntax
    //anathor way for full obeject

    let responce = await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    }).send();
    


    



    
    let url1 = req.file.path;
    let filename1 = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url: url1,       // Correct key name
        filename: filename1 // Correct key name
    };
    
    newListing.geometry = responce.body.features[0].geometry;

    let savedLesting = await newListing.save();
    console.log(savedLesting);

    req.flash("success","New Listing Created!");
    res.redirect("/listings");
})

//edit Route
module.exports.edit = async (req,res)=>{
    let { id } = req.params;
    let list  = await Listing.findById(id); 
    
    if(!list){
        req.flash("error","Listing You requested Does not Exist!")
        res.redirect("/listings")
   }

   let originalImageUrl = list.image.url;

   originalImageUrL = originalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs",{ list,originalImageUrL });
}


//update route
module.exports.update = ( async (req,res)=>{
    if(!req.body.listing) {
        throw new ExpressErrors(400,"Send Valid data!");
    }

    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id ,{ ...req.body.listing});
    
    if(typeof req.file !== "undefined") {
        let url1 = req.file.path;
        let filename1 = req.file.filename;
        updatedListing.image = {
            url: url1,       // Correct key name
            filename: filename1 // Correct key name
        };
        await updatedListing.save();
    }

    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
})

//Delete
module.exports.delete = ( async (req,res)=>{
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Succusfully!");
    
    res.redirect("/listings");

});

 