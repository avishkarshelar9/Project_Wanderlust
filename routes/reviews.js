const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const {listingSchema} = require("../validationSchma.js");
const {ReviewValidation} = require("../validationSchma.js");
const Review = require("../models/reviews.js");
const {isLoggedIn , isOwner ,isAuthour} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");





const validateReview = (req,res,next)=>{
    let {error} = ReviewValidation.validate(req.body);
    
    if(error){
        throw new ExpressErrors(400, error);
    }else{
        next();
    }
}

//Reviews 
//post

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.CreateReview));

//Reviews 
//Delete

router.delete("/:reviewId",isAuthour,wrapAsync(reviewController.delete));

module.exports = router;
