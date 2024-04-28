const express= require("express")
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate")
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb+srv://khirod4300dav:o9yW0Hk3fxDV6biL@mongo3.w7azudc.mongodb.net/?retryWrites=true&w=majority"
main().then(()=>{console.log("db connected succsessfully")})
.catch((err)=>{console.log(err)});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Welcome to homepage");
})

const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{next();}
}

const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{next();}
}

//INDEX ROUTE
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//CREATE ROUTE
app.post("/listings",validateListing,
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
app.get("/listings/:id/edit",async (req,res)=>{
    const {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//UPDATE ROUTE
app.put("/listings/:id",validateListing, async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//DELETE ROUTE
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

//Reviews post route
app.post('/listings/:id/reviews',validateReview, wrapAsync(async(req,res)=>{  let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("review saved");
    res.redirect(`/listings/${listing._id}`);
}))

//Reviews delete route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


// app.get("/testListing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

//error handle
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})
//middlewares
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
})

app.listen("3000",()=>{
    console.log("server started successfully")
})