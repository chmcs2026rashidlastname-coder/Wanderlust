const Listing=require("../models/listing.js");
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
}

module.exports.createform=(req,res)=>{
    res.render("./listings/create.ejs");
}

module.exports.create=async (req,res)=>{
    let url=req.file.path;
    
    let filename=req.file.filename;
   const newListing= new Listing(req.body.listing);
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   // console.log(listing);
   await newListing.save();
   req.flash("success","New Listing Created*");
   res.redirect("/listings");
}

module.exports.editform=async(req,res)=>{
        let {id}=req.params;
    const list=await Listing.findById(id);
    res.render("./listings/edit.ejs",{list});
}

module.exports.edit=async(req,res)=>{
    const{id}=req.params;
  let listing= await Listing.findByIdAndUpdate(id,{...req.body.Listing});
  if(typeof req.file !=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }

   req.flash("success","Updated Successfully*");
    res.redirect("/listings");  
}

module.exports.deletes=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully*");
    res.redirect("/listings");
}

module.exports.show= async (req,res)=>{
const {id}=req.params;
const list= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
if(!list){
    req.flash("error","The page you are trying to look does not exists*")
    res.redirect("/listings");
}
else{
res.render("./listings/find.ejs",{list});
};
}