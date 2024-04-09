var Challenge	        =require("../models/challenges"),
    Comment             =require("../models/comment");

var middlewareObj={}

middlewareObj.answerAuth=function(req,res,next)
{
    if(req.isAuthenticated()){
       Comment.findById(req.params.aid,function(err,ans){
           if(err){
            req.flash("error","Challenge not found!")
               res.redirect("back")
           }else{
                if(req.user._id.equals(ans.author.id)){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that!")
                    res.redirect("/challenges/"+req.params.id+"/answers")
                }
           }
       }) 
    }else{
        req.flash("error","Please Login First!")
        res.redirect("/login")
    }
}

middlewareObj.challengeAuth=function(req,res,next)
{
    if(req.isAuthenticated()){
       Challenge.findById(req.params.id,function(err,post){
           if(err){
               res.redirect("back")
           }else{
                if(req.user._id.equals(post.author.id)){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that!")
                    res.redirect("/challenges")
                }
           }
       }) 
    }else{
        req.flash("error","Please Login First!")
        res.redirect("/login")
    }
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
    req.flash("error","Please Login First!")
	res.redirect("/login")
}


module.exports=middlewareObj;