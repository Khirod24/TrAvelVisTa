const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing= require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{next();}
}

//INDEX ROUTE
router.get("/",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//NEW ROUTE
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));


//CREATE ROUTE
router.post("/",validateListing,
    wrapAsync(async(req,res,next)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send Valid Data For Listing!!")
        // }
        // let result = listingSchema.validate(req.body);
        // if(result.error){
        //     throw new ExpressError(400, result.error)
        // }
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");  
    })
)

//EDIT ROUTE
router.get("/:id/edit",async (req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//UPDATE ROUTE
router.put("/:id",validateListing, async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//DELETE ROUTE
router.delete("/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

module.exports = router;