const   bodyParser          = require("body-parser"),
        express             =require("express"),
        mongoose            =require("mongoose"),
        passport	        =require("passport"),
		LocalStrategy       =require("passport-local"),
		methodOverride      =require("method-override"),
		Challenge	        =require("./models/challenges"),
		User		        =require("./models/user"),
		Comment             =require("./models/comment"),
        flash               =require("connect-flash"),
        app             =express();



var challengesRoutes=require("./routes/challenges");
var commentRoutes	=require("./routes/comments");
var indexRoutes		=require("./routes/index");


//Database Config
var dbUrl=process.env.DATABASEURL || "mongodb://localhost/codequest"
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false});


app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//PASSPORT CONFIGRATION

app.use(require("express-session")({
    secret : process.env.SECRET || "secret",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//passing local objects
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.ferr=req.flash("error");
    res.locals.fsucc=req.flash("success");
    next();
})


//Index
app.get("/",function(req,res){
    res.render("landing");
})
//CIGround
app.get("/ciground",function(req,res){
    res.render("ciground");
})

app.use("/challenges",challengesRoutes);
app.use("/challenges/:id/answers",commentRoutes);
app.use(indexRoutes);
app.get('*', function (req, res) {
    res.status(404).render("404");
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is Running!!");
})