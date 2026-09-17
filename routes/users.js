const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const Listing=require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {ListingSchema,reviewSchema}=require('../schema.js');
const passport=require('passport');
let {savedUrl}=require('../middleware.js');

router.get("/",async(req,res)=>{
    // let newUser=new User({
    //     email:"skhan003@gmail.com",
    //     username:"Rashhan@12",

    // });
    // let Usernew=await User.register(newUser,"rashi906");
    // res.send(Usernew);
  //  console.log("REQUEST:",req.method,req.originalUrl);
    res.render("./listings/usering.ejs");
})
router.post("/done",wrapAsync (async(req,res)=>{
    try{
         let {username,password,email} = req.body;
    const newUser=new User({username,email});
    const registerUser=await User.register(newUser,password);
    
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome User*");
          res.redirect("/listings");
    })
  
    }catch(e){
      req.flash("error",e.message);
      res.redirect("/users");
    }
   
}));
router.get("/login",(req,res)=>{
    res.render("./listings/login.ejs");
});
router.post("/login",savedUrl,passport.authenticate("local",{failureRedirect:"/users",failureFlash:true,}),
async(req,res)=>{
    req.flash("success","Welcome Back User");
    let URL=res.locals.saveUrl||"/listings";
    res.redirect(URL);
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You logged out successfully!");
        res.redirect("/listings");
    })
})
module.exports=router;