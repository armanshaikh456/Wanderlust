const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
const mapToken = process.env.MAPTILER_API_KEY;
maptilerClient.config.apiKey = mapToken;


module.exports.index = async (req, res) => {
    const {category} = req.query;
    let allListings;
    if (category){
        allListings = await Listing.find({category});
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
} 

module.exports.createListing = async (req, res) => {
    const response = await maptilerClient.geocoding.forward(req.body.listing.location, {limit: 1});
    let url = req.file.path;
    if(!url) {
        console.log("url not present")
    }
    let filename = req.file.filename;    
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Lising Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });   
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
