var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");


//root route
router.get("/",function(req,res){
	res.render("landing");
});


//show regs form
router.get("/register",function(req,res){
	res.render("register");
});


//handling sign up logic
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message)
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
		req.flash("success","welcome to YelpCamp "+user.username)
	    res.redirect("/camp");
		});
	});
});


//show login form
router.get("/login",function(req,res){
	res.render("login");
});


//handling logic form
router.post("/login",passport.authenticate("local",{
		successRedirect:"/camp",
		failureRedirect:"/login",
	    failureFlash: true,
        successFlash: "Welcome to YelpCamp!" 
	}),function(req,res){	
});


//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!!");
	res.redirect("/camp");
});


//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	   return next();
	};
	res.redirect("/login");
};

module.exports=router;