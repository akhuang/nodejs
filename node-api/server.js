
var express = require('express'),
    app = new express(),
	path = require('path')，
    bodyParser = require('body-parser'),//get body parse
    morgan = require('morgan'), //used to see requests
    mongoose = require('mongoose'),
    port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());
app.use('/admin',adminRouter);

app.listen(1338);

console.log("visit me at http://localhost:1338");
