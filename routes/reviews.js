const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {validateReview,isAuthor}=require("../middleware.js")
const {isLoggedin}=require("../middleware.js");
const{addReview,delete_review}=require('../controllers/review.js')

router.post("/",validateReview,isLoggedin,wrapAsync(addReview))
// Deleting the Reviews from the listings
router.delete("/:review_id",isLoggedin,isAuthor,wrapAsync(delete_review))

module.exports=router;