const express = require('express');
const User = require("../models/user");
const Doctor = require("../models/doctor");

exports.getInsurance = (req, res, next) => {
    res.render('insuranceCompanies');
}

exports.showDetails = (req, res, next) => {
    res.render('showDetails');
}
