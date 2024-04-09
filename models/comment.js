var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
	answer: String,
	author: {
		id : {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
	language : String,
	created: {type:Date, default:new Date()}
});
var Comment=mongoose.model("Comment", commentSchema);
module.exports=Comment; 