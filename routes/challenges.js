var express=require("express");
const Challenge = require("../models/challenges");
const Comment = require("../models/comment");
var     middleware=require("../middleware");
var router =express.Router();



//Show all challenges
router.get("/",function(req,res){
    Challenge.find(function(err,fpost){
        if(err){
            console.log(err)
        }else{
            res.render("challenges/challenges",{fpost:fpost});
        }
    })  
})

//Add a new challenge
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("challenges/new");
})
//Post a new challenge
router.post("/",middleware.isLoggedIn,function(req,res){
    var title=req.body.title;
    var language=req.body.language;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }

    var newChallenge={
        title:title,
        language:language,
        description:description,
        author:author
    };
    Challenge.create(newChallenge,function(err,newPost){
        if(err){
            console.log(err)
        }else{
            res.redirect("/challenges");
        }
    })  
})

//show one challenge with answers
router.get("/:id/answers",middleware.isLoggedIn,function(req,res){
    Challenge.findById(req.params.id).populate("comments").exec(function(err,post){
        if(err){
            console.log(err)
        }else{
            res.render("challenges/show",{post:post})
        }
    })
})

//edit a challenge form
router.get("/:id/edit",middleware.challengeAuth,function(req,res){
    Challenge.findById(req.params.id,function(err,post){
        if(err){
            console.log(err)
        }else{
            res.render("challenges/edit",{post:post})
        }
    })
})
//updating in server side
router.put("/:id",middleware.challengeAuth,function(req,res){
    // res.send("aya")
    Challenge.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
        if(err){
            console.log(err)
        }else{
            res.redirect("/challenges/"+post._id+"/answers")
        }
    })
})

//deleting a challenge

router.delete("/:id",middleware.challengeAuth,function(req,res){
    Challenge.findById(req.params.id,function(err,post){
        if(err){
            res.redirect("/challenges")
        }else{
            relatedAnswers=post.comments;
            
            relatedAnswers.forEach(function(ans){
                Comment.findByIdAndRemove(ans,function(err){
                    if(err)
                        res.send(err)
                    })
            })
        }
        post.remove(function(err){
            if(err)
                res.send(err)
            else{
                res.redirect("/challenges")
            }
        })
    })
})




module.exports=router;