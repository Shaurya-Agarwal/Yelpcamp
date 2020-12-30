var express=require("express");
var router=express.Router({mergeParams:true});
var Camp=require("../models/camp");
var middleware=require("../middleware");


//INDEX - show all campground
router.get("/",function(req,res){
	Camp.find({},function(err,allCamp){
		if(err){
			console.log("err");
		}else{
			res.render("camps/index",{camp:allCamp});
		}
	});
});


//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("camps/new");
});


//CREATE - create a new campground
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var descp=req.body.descp;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newcamp={name:name,price:price,image:image,descp:descp,author:author};
	Camp.create(newcamp,function(err,newlycreated){
		if(err){
			console.log("err");
		}else{
			res.redirect("/camp");
		}
	});
});


//SHOW - show info abt camps
router.get("/:id",function(req,res){
	Camp.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err){
		console.log(err);
		}else{
		res.render("camps/show",{camp:foundCamp});
		} 
	});
});


router.get("/:id/edit",middleware.check,function(req,res){
		Camp.findById(req.params.id,function(err,foundCamp){
			res.render("camps/edit",{camp:foundCamp});
		});
});

	
router.put("/:id",middleware.check,function(req,res){
	Camp.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedCamp){
		if(err){
			res.redirect("/camp")
		}else{
			res.redirect("/camp/"+req.params.id);
		}
	})
});

	
router.delete("/:id",middleware.check,function(req,res){
	Camp.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/camp");
		}else{
			res.redirect("/camp");
		}
	});
});


module.exports=router;