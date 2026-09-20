const Listing=require("./models/listing.js");
const {ListingSchema,reviewSchema}=require('./schema.js');
const ExpressError=require('./utils/ExpressError.js');
const Review=require("./models/review.js");

module.exports.isLoggedin=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in First");
      return res.redirect("/users/login");
     
    }
        next();
    
})
module.exports.savedUrl=((req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.saveUrl=req.session.redirectUrl;
    }
    next();
})

module.exports.isOwner=(async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();

})

module.exports.isAuthor=(async(req,res,next)=>{
    let {id,review_id}=req.params;
    let isreview = await Review.findById(review_id);
    if(!isreview.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();

})

module.exports.validateListing=(req,res,next)=>{
    let{error}=ListingSchema.validate(req.body);
    if(error){
        let erMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,erMsg);
       

    }else{
        next();
    }
}

 module.exports.validateReview=(req,res,next)=>{
     let{error}=reviewSchema.validate(req.body);
     if(error){
         let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
     }else{
         next();
     }
 };