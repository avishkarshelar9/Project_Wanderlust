require('dotenv').config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const {listingSchema} = require("./validationSchma.js");
const {ReviewValidation} = require("./validationSchma.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;




const User = require("./models/user.js");





// app.get("/",(req,res)=>{
//     res.send("i am root");


// })


//session


const dbUrl =process.env.ATLASDBURL;

const store =MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGOSTORE :",error);
})

const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expiers: Date.now()+7 *24 *60 *60 *1000,
        maxAge: 7 *24 *60 *60 *1000,
        httpOnly: true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
})

//user
app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"abc@gmail.com",
        username:"student"
    });

    let registerdUser = await User.register(fakeUser,"helloworld");
    res.send(registerdUser);
})

// Routing
const listingRouter = require("./routes/listings.js"); 
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const { error } = require('console');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));





main().then(()=>{
    console.log("connection succesful")
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}




//router use
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
    next(new ExpressErrors(404,"Page Not Found!"));
    
})



app.use((err,req,res,next)=>{
    let {statusCode = 500,message ="Somthing Went Wrong!"} = err;
    res.status(statusCode).render("listings/errors.ejs" ,{ message });
    //res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("lisning on 8080");
})