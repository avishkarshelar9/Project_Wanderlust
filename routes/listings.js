const express = require("express");
const router = express.Router();
const Listing = require("../models/listing")
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {listingSchema} = require("../validationSchma.js");
const {ReviewValidation} = require("../validationSchma.js");
const Review = require("../models/reviews.js");
const {isLoggedIn , isOwner} = require("../middleware.js");

const ListingController = require("../controller/listings.js");


const multer  = require('multer');

const {storage} = require("../cloudconfig.js");
const upload = multer({storage});




const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressErrors(400, error);
    }else{
        next();
    }
}


//index Route
router.get("/",wrapAsync (ListingController.index));


//Add New 
router.get("/new",isLoggedIn,(ListingController.new));

//Show Route
router.get("/:id",wrapAsync(ListingController.show));

//create Route
router.post("/",isLoggedIn,upload.single("listing[image]"),
    wrapAsync(ListingController.create));



//edit rout

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.edit));

 //update Route

router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),
wrapAsync(ListingController.update));

//delete Route

router.delete("/:id",isLoggedIn,wrapAsync(ListingController.delete));


module.exports = router;





