 const Listing=require("../models/listing")
 
 module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  console.log(allListings);
  res.render('listings/index.ejs', { allListings });
  }

  module.exports.renderNewForm=( req, res) => {
    res.render("listings/new.ejs");
  }
  

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
       path :"reviews",
       populate :{
       path: "author",
     },
})
    .populate("owner");
    if(!listing){
     req.flash("error","listing you requested for doesnot exist");
     res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  }


  module.exports.createListing=async (req, res, next) => {
    let url= req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    //  newListing.owner=req.user._id;
     newListing.image= {url,filename};
    await newListing.save();
     req.flash("success","new listing created");
     res.redirect("/listings");
   }

  module.exports.renderEditForm= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
  }

  module.exports.updateListing= async (req, res) => {
    const { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
    let url= req.file.path;
    let filename=req.file.filename;
    listing.image= {url,filename};
    await listing.save();
    }
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }

  module.exports.searchListings = async (req, res) => {
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
    const listings = await Listing.find({ title: regex });
    res.render('listings/search.ejs', { listings, query });
  };
  