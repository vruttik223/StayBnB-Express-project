const express = require('express');
const router=express.Router({mergeParams:true})
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require('../utils/wrapasync.js');
const { isLoggedIn } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((element) => element.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

// Reviews
// Create review
// router.post('/',isLoggedIn, async (req, res) => {
//     const listingId = req.params.id;
//     const { rating, comment } = req.body.review;
  
//     try {
//         // Validate review data
//         const { error } = reviewSchema.validate({ review: req.body.review });
//         if (error) {
//             console.log(error);
//             return res.status(400).send('Invalid data');
//         }
  
//         // Create a new review
//         const newReview = new Review({
//             rating,
//             comment
//         });
  
//         // Save the review
//         await newReview.save();
  
//         // Find the listing by ID and push the review's ObjectId into reviews array
//         const listing = await Listing.findById(listingId);
//         listing.reviews.push(newReview._id);
//         await listing.save();
  
//         res.redirect(`/listings/${listingId}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error submitting review');
//     }
//   }); 
  router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  
  // delete review route
  router.delete("/:reviewId",isLoggedIn, wrapAsync())
  
  module.exports=router