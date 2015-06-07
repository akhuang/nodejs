
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
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// log all the requests to console
app.use(morgan('dev'));

////basic route for the home page
//app.get('/', 'public/views/index.html');

var apiRouter = require('./app/routes/api.routes')(app, express);
// register routes
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// start the server
app.listen(port);

console.log("visit me at http://localhost:" + port);
