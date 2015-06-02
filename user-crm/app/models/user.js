var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

//use Schema
var UserSchema = new Schema({
    name:String,
    username: { type:String, required: true, index: { unique: true }},
    password: { type:String, required: true, select: false }
});

//hash the password before the user is saved.
UserSchema.pre('save',function(next){
    var user = this;

    //hash the password only if the password has been changed or user is new
    if(!user.isModified('password')) return next();

    //generate hash
    bcrypt.hash(user.password,null,null,function(err,hash){
        if(err) {
            return next(err);
        }

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password,user.password);
};

module.exports = mongoose.model('User',UserSchema);
