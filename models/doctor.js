var mongoose = require('mongoose');


var doctorSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
    mobile : Number,
    license : Number,
    email : String,
    hospital : String,
    specialization : String,
	password: String,
    password1: String,
    profile : String
    
});



module.exports = mongoose.model("Doctor", doctorSchema);