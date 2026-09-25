const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const passport=require('passport');
let {savedUrl}=require('../middleware.js');
const {userform,user,loginform,login,logout}=require('../controllers/user.js')

router.get("/",userform)
router.post("/done",wrapAsync (user));
router.route("/login")
.post(savedUrl,passport.authenticate("local",{failureRedirect:"/users",failureFlash:true,}),
login
).get(loginform)
router.get("/logout",logout)
module.exports=router;