if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require('passport');
const LocalPassword=require('passport-local');
const passportLocalMongoose=require('passport-local-mongoose');
const User=require('./models/user.js');
const users=require('./routes/users.js');
//const ejsMate = require("ejs-mate");


const sessionOptions={
    secret:"mySuperSecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalPassword(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/users",users);

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