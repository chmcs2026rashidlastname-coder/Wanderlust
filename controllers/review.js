const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.addReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let {id}=req.params;
    let addReview=new Review(req.body.review);
    addReview.author=req.user._id;

    listing.reviews.push(addReview);
    await addReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully*");
    res.redirect(`/listings/${id}`);
}

module.exports.delete_review=async(req,res)=>{
    let {id,review_id}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}})
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted Successfully*");
    res.redirect(`/listings/${id}`);

}