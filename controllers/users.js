const User=require("../models/user")

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signup=async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err)
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
        

      })
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm=(req, res) => {
    console.log("login page requested")
  res.render("users/login.ejs");
}

module.exports.login=async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
        // condition for home page nd task pages
       res.redirect(redirectUrl);
      // so here we call local user now go to that page which has already
  }

  module.exports.logout= (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out");
      res.redirect("/listings");
    });
  }