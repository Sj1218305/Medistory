 const express= require('express');
 const User   = require("../models/user");
 const bcrypt 			  = require('bcryptjs');


 exports.getHomepage = (req,res,next) =>{
    res.render('index');
 }

 exports.getRegister=(req,res,next)=>{
	res.render('new');
 }
exports.getPDashboard=(req,res,next)=>{
    res.render('patientdashboard');
    }




exports.postRegister=(req,res,next)=>{
    const   firstName = req.body.patient.firstName;
    const   lastName = req.body.patient.lastName;
    const    mobile = req.body.patient.mobile;
    const    aadhar = req.body.patient.aadhar;
    const    email = req.body.patient.email;
    const    address = req.body.patient.address;
    const    username = req.body.patient.username;
    const    occupation  = req.body.patient.occupation;
    const    password = req.body.patient.password;
    const    password1 = req.body.patient.password1;
    const    date = req.body.patient.date;
    const    month = req.body.patient.month;
    const    year  = req.body.patient.year;
    
    console.log(req.body);
   let errors = [];
    if(password !==  password1){
        errors.push({msg: 'Passwords do not match'});
    }

    if(errors.length>0){
        res.render('new');}
    
    User.findOne({ username : username})
    .then(userInfo => {
        if(userInfo){
           
            res.render('new');
        }
        else{
            bcrypt.hash(password,12)
            .then(hashedPw => {
                const user = new User({
                    firstName : firstName,
                    lastName : lastName,
                    mobile : mobile,
                    aadhar : aadhar,
                    email : email,
                    password : hashedPw,
                    address : address,
                    username : username,
                    occupation : occupation,
                    date : date,
                    month : month, 
                    year : year                   
                });
                user.save()
                .then(result => {
                    console.log('user saved successfully');
                    User.findById(user.id,function(err,userDetails){
                        if(err){
                            console.log(err);
                        }else{
                            res.render('patientdashboard',{user : userDetails, sent : false, patientDetails:user.details});
                        }
                        
                    })
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
            }
        })
    .catch(err =>{
        console.log(err);
    });
}

exports.getLogin=(req,res,next)=>{
	res.render('login');
 }

 exports.postLogin=(req,res,next)=>{
  
    const password = req.body.password;
    const username = req.body.username;

    User.findOne({ username : username})
    .then(user => {
        if(!user){
            
            res.redirect('/login');
        }
        else{
           // console.log(user);
            bcrypt.compare(password, user.password)
            .then(matching => {
                if(matching){
                    req.session.username = username;
                    User.findById(user.id,function(err, userDetails){
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render('patientdashboard',{user : userDetails, sent : false, patientDetails:user.details});
                        }

                    });
                    
                }
                else{
                    res.redirect('/login');
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    })
    .catch(err =>{
        console.log(err);
    });
 }


 exports.getDetails = (req,res) => {
    const username = req.body.username;
    User.findOne({username : username }, (err, res1) => {
    if(err) console.log(err);
    res.render('choose',{details : res1.details, sent : false})
    
    }) 
}



exports.add = (req,res)=>{
    console.log(req.body);
    var checkedBody = req.body;
    if(checkedBody.checked == true){
       
    }
    res.redirect('/')
}
    
    
