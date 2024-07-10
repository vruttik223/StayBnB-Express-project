const Listing = require("../models/listing.js");
// controllers
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm=( req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id)
        .populate({
          path: "reviews",
          populate: {
            path: "author",
          },
        })
        .populate("owner"); // Ensure 'owner' field is populated correctly
  
      if (!listing) {
        req.flash("error", "Place not found");
        return res.redirect("/listings");
      }
  
      res.render("listings/show.ejs", { listing });
    } catch (err) {
      console.error("Error fetching place:", err);
      req.flash("error", "Error fetching place");
      res.redirect("/listings");
    }
  };
//   module.exports.showListing=async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id)
//     .populate({
//        path :"reviews",
//        populate :{
//        path: "author",
//      },
// })
//     .populate("owner");
//     if(!listing){
//      req.flash("error","listing you requested for doesnot exist");
//      res.redirect("/listings")
//     }
//     res.render("listings/show.ejs", { listing });
//   }

  module.exports.createListing=async (req, res, next) => {
   let url= req.file.path;
   let filename=req.file.filename;
   const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image= {url,filename};
   await newListing.save();
    req.flash("success","new Place added");
    res.redirect("/listings");
  }
  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Place you requested for doesnot exist");
      res.redirect("/listings");
     }
    
  }

  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if( typeof req.file !="undefined"){
    let url= req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
}
    req.flash("success","Place updated");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete({ _id: id });
    console.log(deletedListing);
    req.flash("success"," Place deleted");
    res.redirect(`/listings`);
  }