var mongoose    =require("mongoose"),
    passportLocalMongoose   =require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String
    },
    date:{
        type:String,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);