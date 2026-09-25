const User=require('../models/user.js');

module.exports.userform=async(req,res)=>{
    res.render("./listings/usering.ejs");
}

module.exports.user=async(req,res)=>{
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
   
}

module.exports.loginform=(req,res)=>{
    res.render("./listings/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back User");
    let URL=res.locals.saveUrl||"/listings";
    res.redirect(URL);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You logged out successfully!");
        res.redirect("/listings");
    })
}