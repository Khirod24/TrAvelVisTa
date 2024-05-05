const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", async(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = await User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){return next(err);}
        req.flash("success","Welcome to TraVelVisTa");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{res.render("users/login.ejs")})

router.post("/login", saveRedirectUrl ,passport.authenticate("local", {
    failureRedirect:"/login",
    failureFlash:true,
}) ,async(req,res)=>{
    req.flash("success","Welcome to TrAvelVisTa");
    res.redirect(res.locals.redirectUrl);
})

router.get("/logout", async(req,res,next)=>{
    req.logOut((err)=>{
        if(err){next(err);}
        else{
            req.flash("success", "You are logged out now!!")
            res.redirect("/listings");
        }
    })
})

module.exports = router;