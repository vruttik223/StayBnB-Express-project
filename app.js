if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');

const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapasync.js');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
 //routers
 const listingsRouter=require("./routes/listing.js");
 const reviewsRouter=require("./routes/review.js");
 const userRouter=require("./routes/user.js");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log('Connection to MongoDB successful');
  })


  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// SESSION STARTED
const store=MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions ={
    store,
    // store=store or also write this
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)},
      maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
};


app.use(session(sessionOptions));
app.use(flash());


//passport initalize,session()
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
//serializeUser() Generates a function that is used by Passport to store data of user as they login
//deserializeUser() Generates a function that is used by Passport to remove the data from web
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
//console.log(res.locals.success);
next();
})

// Root route
app.get('/', (req, res) => {
  res.redirect('/listings');

});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);


app.use("/",userRouter);



// 404 route.


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});


app.listen(8000, () => {
  console.log('Server running on port 8000');
});
