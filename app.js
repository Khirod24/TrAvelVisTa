if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express= require("express")
const app= express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User= require("./models/user");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


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
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req,res)=>{
//     const fakeUser = await User({
//         email:"khirod4300dav@gmail.com",
//         username:"goodboi123"
//     })
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewsRouter);

app.use("/", userRouter);

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