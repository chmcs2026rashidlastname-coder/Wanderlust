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
