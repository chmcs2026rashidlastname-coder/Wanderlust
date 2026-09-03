const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const {ListingSchema,reviewSchema}=require('./schema.js');
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
app.engine('ejs',ejsMate);


//const sampleListings=require("./data/data.js");
main().then(()=>{
    console.log("Server is connected without any issue!")
}).catch((err)=>{
    console.log("Error:"+err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("The server is working perfectly fine!");
})

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
app.use("/listings",listings);
app.post("/listing/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let {id}=req.params;
    let addReview=new Review(req.body.review);
    listing.reviews.push(addReview);
    await addReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}))
// Deleting the Reviews from the listings
app.delete("/listing/:id/reviews/:review_id",wrapAsync(async(req,res)=>{
    let {id,review_id}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}})
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/listings/${id}`);

}))
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{
    let{status=500,message="Something went Wrong"}=err;
//res.status(status).send(message);
  //  next(err);
    res.render("error.ejs",{err,status,message});
})

app.listen(8080,()=>{
    console.log("App is listening on port 8080");
})