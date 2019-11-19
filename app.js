const express                 = require("express");
const	mongoose              = require("mongoose");
const   bodyParser            = require("body-parser");
const authroutes              = require('./routes/patientRoutes');
const authroutes1 			  = require('./routes/doctorRoutes');
const authroutes2			  = require('./routes/insuranceRoutes');
const Nexmo                   = require('nexmo');
const socket                  = require('socket.io');
//APP CONFIG
mongoose.connect("mongodb://localhost/UMID",{useNewUrlParser: true});
var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret : "i am the best",
	resave : true,
	saveUninitialized :true
}));

//MONGO Depreciation Warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(authroutes);
app.use(authroutes1);
app.use(authroutes2);

app.get('*', function(req,res){
    res.send("Sorry!! Page not found");
    });

app.listen(3000,function(req,res){
    console.log("server has started");
       });