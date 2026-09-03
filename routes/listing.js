const express=require('express');
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {ListingSchema,reviewSchema}=require('../schema.js');

const validateListing=(req,res,next)=>{
    let{error}=ListingSchema.validate(req.body);
    if(error){
        let erMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,erMsg);
       

    }else{
        next();
    }
}

router.get("/",wrapAsync(async (req,res)=>{
    // const list=new Listing({
    //     title:"Rashid",
    //     description:"I am khan mohammed Rashid Aziz rehman",
    //     image:"This is the image",
    //     price:22,
    //     location:"Shivaji chaowk ulhasnagar",
    //     country:"India"
    // })
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
        //res.send("Successfully done!")
  //  await list.save();

  //  res.send("Sucessfull!");


}))
router.get("/:id",wrapAsync( async (req,res)=>{
const {id}=req.params;
const list= await Listing.findById(id).populate("reviews");
res.render("./listings/find.ejs",{list});
}))
router.get("/create/form",(req,res)=>{
    
    res.render("./listings/create.ejs");
})
router.post("/create",validateListing,wrapAsync(async (req,res)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Listing is empty");
    // }
    // let result=ListingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    

   
   const newListing= new Listing(req.body.listing);
   // console.log(listing);
   await newListing.save();
   res.redirect("/listings");
}))
router.get("/edit/:id",wrapAsync(async(req,res)=>{
    
        const {id}=req.params;
    const list=await Listing.findById(id);
    res.render("./listings/edit.ejs",{list});
   
}))

router.put("/edit/:id",wrapAsync(async(req,res)=>{
    const{id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listings");

    
}))
router.delete("/delete/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


module.exports=router;

