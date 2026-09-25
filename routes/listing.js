const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const {index,createform,create,editform,edit,deletes,show}=require('../controllers/listings.js');
const multer=require('multer');
const {storage}=require('../cloudStorage.js');
const upload=multer({storage});

router.get("/",wrapAsync(index))
router.get("/create/form",isLoggedin,(createform))
router.post("/create",isLoggedin,upload.single('listing[image][url]'),validateListing,wrapAsync(create));

router.route("/edit/:id").get(isLoggedin,isOwner,wrapAsync(editform))
.put(isLoggedin,upload.single('listing[image][url]'),isOwner,wrapAsync(edit))

router.delete("/delete/:id",isLoggedin,isOwner,wrapAsync(deletes))
router.get("/:id",isLoggedin,wrapAsync(show))
module.exports=router;

