const express= require("express")
const app= express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate")
const session = require("express-session");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

const sessionOptions ={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionOptions));


app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

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