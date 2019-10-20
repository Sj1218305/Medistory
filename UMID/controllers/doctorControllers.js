const fetch = require("node-fetch")
const express = require('express');
const Doctor = require("../models/doctor");
const bcrypt = require('bcryptjs');
const User = require("../models/user");



exports.getRegister = (req, res, next) => {
    res.render('newd');
}

exports.postRegister = (req, res, next) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mobile = req.body.mobile;
    const license = req.body.license;
    const email = req.body.email;
    const hospital = req.body.hospital;
    const specialization = req.body.specialization;
    const password = req.body.password;
    const password1 = req.body.password1;
    const profile = req.body.profile;

    // console.log(req.body);
    let errors = [];
    if (password !== password1) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        console.log(errors)
        res.render('newd');
    }
    //  console.log(email)
    Doctor.findOne({ email: email })
        .then(doctorInfo => {
            console.log(doctorInfo)
            if (doctorInfo) {
                res.render('newd');
            }
            else {
                bcrypt.hash(password, 12)
                    .then(hashedPw => {
                        const doctor = new Doctor({
                            firstName: firstName,
                            lastName: lastName,
                            mobile: mobile,

                            license: license,
                            email: email,
                            password: hashedPw,
                            hospital: hospital,
                            specialization: specialization,
                            profile: profile

                        });
                        doctor.save()
                            .then(result => {
                                console.log('user saved successfully');
                                // res.redirect('/doctordashboard');
                                res.render("/doctordashboard", { doctor: { firstName: firstName }, otpSent: false });
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
        .catch(err => {
            console.log(err);
        });
}
exports.getLogin = (req, res, next) => {
    res.render('logind');
}
let ssn = {};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Doctor.findOne({ email: email })
        .then(doctor => {
            if (!doctor) {
                res.redirect('/logind');
            }
            else {
                console.log(doctor);
                ssn["doctorDetails"] = doctor;
                // console.log(user);
                bcrypt.compare(password, doctor.password)
                    .then(matching => {
                        if (matching) {
                            req.session.email = email;
                            Doctor.findById(doctor.id, function (err, doctorDetails) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    req.session.doctorName = doctorDetails.firstName
                                    res.render('doctordashboard', { doctor: doctorDetails, otpSent: false });
                                }

                            });

                        }
                        else {
                            res.redirect('/logind');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
}
exports.authLogin = (req, res, next) => {
    const number = req.body.mobile;
    const username = req.body.username;
    User.findOne({ username : username }).
        then(user => {
            if (!user) {
                res.redirect('/logind');
            } else {
                const otp = Math.round(Math.random() * 1000000);
                const currentTime = (new Date()).toISOString();
                User.findOneAndUpdate({ mobile: number }, { otp: otp, otpGenTime: currentTime }, function (err, affected, resp) {
                    console.log(err, resp);
                    // req.session.patientNumber = number;
                    ssn.patientNumber = number;
                    res.render('doctordashboard', { doctor: { firstName: req.session.doctorName }, number: number, otpSent: true })
                    // fetch("https://www.way2sms.com/api/v1/sendCampaign", {
                    //     body: JSON.stringify({ "apikey": "7DD4WAC03H82TNASL2D6DJUGI8Y6TMGG", "secret": "4QK9ERKYPXLGTQKJ", "usetype": "stage", "senderid": "tj1", "phone": String(number), "message": `The OTP is ${otp}` }),
                    //     headers: {
                    //         "Content-Type": "application/json"
                    //     },
                    //     method: "POST"
                    // }).then(e => {
                    //     if (e.status == 200)
                    // }).catch(er => console.log(err))
                })
            }
        })

}

exports.confirmOTP = (req, res, next) => {
    const OTP = req.body.otp;
    const patientNumber = req.body.number;
    User.findOne({ mobile: patientNumber }, (err, user) => {
        if (err) res.send(err)
        const otpGenTime = new Date(user.otpGenTime);
        const savedOTP = user.otp;
        const currentTime = new Date();
        const timeDiff = (currentTime - otpGenTime) / (1000 * 60);

        if (savedOTP == OTP && timeDiff < 5) {
            ssn.patientNumber = patientNumber;
            console.log(ssn)
            res.render("patientdashboard", { user: user, sent: true, patientDetails: user.details, doctor: ssn.doctorDetails });
        }
        else {
            res.send("OTP Not same")
        }
    })
    console.log(OTP, patientNumber);
}

exports.getDDashboard = (req, res, next) => {
    res.render('doctordashboard');
}


exports.getPDashboard = (req, res, next) => {
    res.render('patientdashboard');
}


exports.addReport = (req, res) => {
    console.log('hello');
    console.log(ssn.patientNumber);
    console.log(req.session);
    User.findOne({ mobile: ssn.patientNumber }, (err, res1) => {
        if (err) console.log(err);
        console.log(res1)
        req.body.details.created = (new Date()).toISOString()
        let temp = res1.details;
        //console.log(temp)
        res1.details.push(req.body.details);
        //console.log(temp)
        User.findOneAndUpdate({ mobile: ssn.patientNumber }, { details: res1.details }, (err, aff, response) => {
            console.log(err, res);
            res.render('patientdashboard', { user: res1, patientDetails: res1.details, doctor: ssn.doctorDetails, sent: true });
        });
    })
}
