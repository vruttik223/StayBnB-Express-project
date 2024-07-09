const Listing=require("./models/listing");
const Review=require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        // if user perform any task and login req after login user redirect go to that task/url
        req.flash("error", "Please log in to continue");
        return res.redirect("/login");
    }
    next();
};
// stored redirect to local so we can accessanywhere
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// checking if user is owner of listing to edit or delete by matching ownerid with curruser
// module.exports.isOwner=async(req,res,next)=>{
//     let {id}=req.params;
//     let listing= await Listing.findById(id);
//     if(!listing.owner._id.equals(res.locals.currUser._id)){
//         req.flash("error","you are not the owner of listing");
//         return res.redirect(`/listings/${id}`)
//        }
//        next();
// }

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (error) {
        next(error);
    }
};
