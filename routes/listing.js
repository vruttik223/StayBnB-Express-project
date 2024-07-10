const express = require('express');
const router=express.Router()
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn , isOwner } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

console.log(isLoggedIn); 

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((element) => element.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  }; 
  // making routes more compact with router.route which help to maintain mv c sturucture 
  router 
  .route("/")
  .get( wrapAsync(listingController.index))    // index route
.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)) ;  // Create route

 // New route


router.get('/new', isLoggedIn,listingController.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingController.showListing))  // Show route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))  // Update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)) // Delete route

// Edit route
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// search
router.get('/search', wrapAsync(listingController.searchListings));

//   // Route index
// router.get('/', wrapAsync(listingController.index));
  
//   // New route
//   router.get('/new', isLoggedIn,listingController.renderNewForm);
  
//   // Show route
//   router.get('/:id', wrapAsync(listingController.showListing));
  
//   // Create route
//   router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createListing));
  
  // // Edit route
  // router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
  
//   // Update route
//   router.put('/:id',  isLoggedIn,isOwner,wrapAsync(listingController.updateListing));
  
//   // Delete route
//   router.delete('/:id', isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


  module.exports=router
