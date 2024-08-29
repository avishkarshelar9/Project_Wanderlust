const Listing = require("./models/listing");
const reviews = require("./models/reviews");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


//owner authorization Function

module.exports.isOwner = async(req,res,next) => {

    let { id } = req.params;
    let list  = await Listing.findById(id); 
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You Are Not The Owner!");
        return res.redirect(`/listings/${id}`);
    } 
    next();

}

//review authour authorization Function
module.exports.isAuthour = async(req,res,next) => {

    let {id, reviewId  } = req.params;
    let review  = await reviews.findById(reviewId); 
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();

}