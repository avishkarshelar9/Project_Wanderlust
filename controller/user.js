const User = require("../models/user.js");


module.exports.signup =(req,res)=>{
    
    res.render("user/Signup.ejs");
}

module.exports.signupPost = (async (req,res)=>{
    
    try{
        let {username ,email ,password} = req.body;
        const newUser =new User({
        username,email
        })
        const registerdUser = await User.register(newUser,password);
        req.login(registerdUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome To Wanderlust!");
            res.redirect("/listings");
        })
        
    } catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
        
})

//show login
module.exports.loginShow = (req,res)=>{
    res.render("user/login.ejs");
}

//login
module.exports.login = async (req,res)=>{
    req.flash("success", "Welcome Back To Wanderlust");
    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}

//logout
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return next(err);
        }

        req.flash("success", "Your Logged Out!");
        res.redirect("/listings");
    })
    
}