const express = require('express');
const doctorControllers = require('../controllers/doctorControllers');


const router = express.Router();



router.get('/DR',doctorControllers.getRegister);
router.get('/logind',doctorControllers.getLogin);
router.get('/doctordashboard',doctorControllers.getDDashboard);
router.post('/addDoctor',doctorControllers.postRegister);
router.post('/logindoctor',doctorControllers.postLogin)
router.post('/authNumber',doctorControllers.authLogin)
router.post('/checkOTP',doctorControllers.confirmOTP);
router.get('/patientdashboard',doctorControllers.getPDashboard);
router.post('/addReport',doctorControllers.addReport);

//router.post('/viewReport',doctorControllers.viewReport);

module.exports=router;