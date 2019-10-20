const express = require('express');
const patientControllers = require('../controllers/patientController');


const router = express.Router();



router.get('/',patientControllers.getHomepage);
router.get('/PR',patientControllers.getRegister);
router.get('/patientdashboard',patientControllers.getPDashboard);
router.post('/addPatient',patientControllers.postRegister);
router.get('/login',patientControllers.getLogin);
router.post('/login',patientControllers.postLogin);
router.post('/chooseDetails',patientControllers.getDetails);
router.post('/add',patientControllers.add);
module.exports=router;