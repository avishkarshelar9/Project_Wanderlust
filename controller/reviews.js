const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");


//create New Review

module.exports.CreateReview = (async (req,res)=>{

    let { id } = req.params;
    let list  = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.authour);
    

    list.reviews.push(newReview);


    await newReview.save();
    await list.save();
    req.flash("success","Review Created SuccesFully");

    res.redirect(`/listings/${id}`);

})

//delete Review

module.exports.delete = (async(req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Deleted SuccesFully");
    res.redirect(`/listings/${id}`);
})

