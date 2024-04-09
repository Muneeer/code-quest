var mongoose=require("mongoose");
var ChallengesSchema=new mongoose.Schema({
	title : String,
    language: String,
	description : String,
	author: {
		id : {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
	comments : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
    created: {type:Date, default:Date.now}
	// created: {type:Date, default:new Date()}
});
var Challenge=mongoose.model("challenge", ChallengesSchema);
module.exports=Challenge;