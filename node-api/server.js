
var express = require('express'),
    app = new express(),
	path = require('path'),
    bodyParser = require('body-parser'),//get body parse
    morgan = require('morgan'), //used to see requests
    mongoose = require('mongoose'),
    port = process.env.PORT || 8080,
    jwt = require('jsonwebtoken');

var superSecret = 'iloveyunakfkdjfkj39023';

mongoose.connect('mongodb://localhost:27017/test');

var User = require('./app/models/user');

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

// ROUTE FOR OUR API
//==============================

//basic route for the home page
app.get('/',function(req,res){
    res.send("Welcome to the home page!");
});

var apiRouter = express.Router();

apiRouter.post('/authenticate',function(req,res){
    console.log(req.body.username);
    User.findOne({ username:req.body.username})
        .select('name username password')
        .exec(function(err,user){
            if(err){
                throw err;
            }

            if(!user){
                res.json({success:false,message:'Authentication failed. User not found.'});
            }
            else if(user) {
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({ success:false,message: 'Authencation failed. Wrong password.'});
                }
                else {
                    var token = jwt.sign({
                        name:user.name,
                        username:user.username
                    },superSecret,{
                        expiresInMinutes: 1440
                    });
                    res.json({
                        success:true,
                        message: 'Enjoy your token',
                        token : token
                    });
                }
            }
        });
});

// middleware
apiRouter.use(function(req,res,next){
    console.log("somebody just came to our app.");

    next();
});
// accessed at /api
apiRouter.get("/",function(req,res){
    res.json({ message : 'phoenix! welcome to our api. '});
});

apiRouter.route("/users")
    .post(function(req,res){
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if(err){
                if(err.code==11000){
                    return res.json({ success:false,message:"a user with that username already exists."});
                }
                else {
                    return res.send(err);
                }
            }

            res.json({message:'User created!'});
        });
    })
    .get(function(req,res){
        User.find(function(err,users){
            if(err){
                return res.send(err);
            }
            res.json(users);
        });
    });

apiRouter.route("/users/:user_id")
    .get(function(req,res){
        User.findById(req.params.user_id,function(err,user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    })
    .put(function(req,res){
        User.findById(req.params.user_id,function(err,user){
            if(err){
                res.send(err);
            }
            if(req.body.name){
                user.name=req.body.name;
            }
            if(req.body.username){
                user.username = req.body.username;
            }
            if(req.body.password){
                user.password = req.body.password;
            }

            user.save(function(err){
                if(err){
                    res.send(err);
                }
                res.json({ message:'User updated!'});
            });
        });
    })
    .delete(function(req,res){
        User.remove({_id: req.params.user_id},function(err,user){
            if(err){
                res.send(err);
            }

            res.json({message:"Successfully deleted."});
        });
    });

// register routes
// all of our routes will be prefixed with /api
app.use('/api',apiRouter);

// start the server
app.listen(port);

console.log("visit me at http://localhost:"+ port);
