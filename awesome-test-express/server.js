
var express = require('express'),
    app = new express(),
	path = require('path');

var adminRouter = express.Router();

adminRouter.use(function(req,res,next){
	//res.send("adminrouter.use");
	console.log(req.method,req.url);
	next();
});

adminRouter.param("name",function(req,res,next,name){
    console.log("doing name validation on " + name);
    req.name = name;

    next();
});

adminRouter.get("/",function(req,res){
	res.send("I am dashboard.");
});

adminRouter.get("/users",function(req,res){
	res.send("I show all users.");
});

//route with parameters
//use req.params.name or req.name with param middleware
adminRouter.get("/users/:name",function(req,res){
    res.send('hello ' + req.name);
});


app.get("/",function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.route("/login")
    .get(function(req,res){
        res.send("this is login form.");
    })
    .post(function(req,res){
        console.log("processing");
        res.send("processing the login form.");
    });

app.use('/admin',adminRouter);

app.listen(1338);

console.log("visit me at http://localhost:1338");
