const User = require("../models/user");

module.exports.renderSignUpForm = async(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
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
}

module.exports.renderLoginForm = (req,res)=>{res.render("users/login.ejs")}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to TrAvelVisTa");
    if(res.locals.redirectUrl){res.redirect(res.locals.redirectUrl);}
    else{res.redirect("/listings");}
}

module.exports.logout = async(req,res,next)=>{
    req.logOut((err)=>{
        if(err){next(err);}
        else{
            req.flash("success", "You are logged out now!!")
            res.redirect("/listings");
        }
    })
}