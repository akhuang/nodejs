
var express = require('express'),
    app = new express(),
    config = require('./config'),
	path = require('path'),
    bodyParser = require('body-parser'),//get body parse
    morgan = require('morgan'), //used to see requests
    mongoose = require('mongoose'),
    port = config.port;

mongoose.connect(config.database);

// APP CONFIGURATION---------------------------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

// allow any domain to access our api
// configure out app to handle CORS requests
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','GET,POST');
    res.setHeader('Access-Control-Allow-Header','X-Requested-With,content-type,Authorization');

    next();
});

// log all the requests to console
app.use(morgan('dev'));

//basic route for the home page
app.get('/',function(req,res){
    res.send("Welcome to the home page!");
});

var apiRouter = require('./app/routes/api.routes')(app,express);
// register routes
// all of our routes will be prefixed with /api
app.use('/api',apiRouter);

// start the server
app.listen(port);

console.log("visit me at http://localhost:"+ port);
