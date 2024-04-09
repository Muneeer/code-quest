var express=require("express");
const Challenge = require("../models/challenges");
const Comment	=require("../models/comment");
var     middleware=require("../middleware");

var router =express.Router({mergeParams: true});


//showing form to add new answer
router.get("/new",middleware.isLoggedIn,function(req,res){
    Challenge.findById(req.params.id,function(err,post){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{post:post});
        }
    }) 
})
//saving new answer to database
router.post("/",middleware.isLoggedIn,function(req,res){
    Challenge.findById(req.params.id,function(err,post){
        console.log(req.body.comment)
        Comment.create(req.body.comment,function(err,ans){
            if(err){
                console.log(err)
            }else{
                ans.author.id=req.user._id;
                ans.author.username=req.user.username;
                ans.save();
                post.comments.push(ans);
                post.save();
                res.redirect("/challenges/"+post._id+"/answers");

            }
        })
    })
})

//showing form to edit answer
router.get("/:aid/edit",middleware.answerAuth,function(req,res){
    Challenge.findById(req.params.id,function(err,post){
        if(err){
            res.redirect("back")
        }else{
            Comment.findById(req.params.aid,function(err,answer){
                if(err){
                    res.redirect("back")
                }else{
                    res.render("comments/edit",{post:post,answer:answer})
                }
            })
        }
    })
})
//updating the answer in database
router.post("/:aid",middleware.answerAuth,function(req,res){
    Comment.findByIdAndUpdate(req.params.aid,req.body.comment,function(err,comment)
    {
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/challenges/"+req.params.id+"/answers")
        }
    })
})
//deleting the answer
router.delete("/:aid",middleware.answerAuth,function(req,res){
    Comment.findByIdAndRemove(req.params.aid,function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/challenges/"+req.params.id+"/answers")
        }

    })
})


//Answer Auth






module.exports=router;