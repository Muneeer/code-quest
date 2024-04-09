var express=require("express");
var router =express.Router();
var passport=require("passport");
var User=require("../models/user");
const bcrypt=require("bcryptjs")


//getting the register form 
router.get("/register",function(req,res){
	res.render("register");
})

//registering a user to database

router.post("/register",function(req,res){
	const {name,username, email, password, cpass}=req.body;

	let errors=[];

	if(!name || !email || !password || !cpass){
		errors.push({msg : 'Please fill in all fields'});
	}
	else if(password!=cpass){
		errors.push({msg:"Passwords do not match!"});
	}
	else if(password.length<6){
		errors.push({msg:"Passwords be atleast 6 characters"});
	}else{
		errors.push();
	}

	if(errors.length>0){
		res.render("register",{
			errors,
			name,
			username,
			email,
			password,
			cpass
		})
	}else{
		//Validation 
		User.findOne({$or : [
			{email:email},
		{username:username}]})
		.then(user=>{
			if(user){
				//User exists
				errors.push({msg:"Email or username is already registered"});
				res.render("register",{
					errors,
					name,
					username,
					email,
					password,
					cpass
				})
			}else{
				const newUser=new User({
					name,
					username,
					email
				})
				// console.log(pass)

				User.register(newUser,password,function(err,user){
					if(err){
						return res.render("register")
					}
					
					passport.authenticate("local")(req,res,function(){
						req.flash("success","Welcome "+user.name)
						res.redirect("/challenges")
					})
				})

			}
		});
	}
})



//getting the login form
router.get("/login",function(req,res){
	res.render("login");
})

//login in
router.post("/login",checkFields,passport.authenticate("local",
	{
		successRedirect: "/challenges",
		failureRedirect:"/login",
		failureFlash:true
	}), function(req,res){
	
})

router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/challenges");
})

function checkFields(req,res,next){
	const {username, password}=req.body;
	let errors=[];
	if(!password || !username){
		errors.push({msg : 'Please fill in all fields'});
	}
	if(errors.length>0){
		res.render("login",{
			errors,
			username,
			password
		})
	}

	next()
}

module.exports=router;