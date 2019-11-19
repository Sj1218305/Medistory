var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
    mobile : Number,
    aadhar : Number,
    email : String,
    address : String,
	username : String,
	occupation : String,
	password: String,
    password1: String,
    otp:   Number,
    otpGenTime: String,
    date : Number,
    month : Number,
    year : Number,
    details: {type : Array, "default" : []},
 
});



module.exports = mongoose.model("User", UserSchema);