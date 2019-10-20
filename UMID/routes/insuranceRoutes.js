const express = require('express');
const insuranceControllers = require('../controllers/insuranceControllers');

const router = express.Router();


router.get('/showDetails',insuranceControllers.showDetails);
router.get('/insurance',insuranceControllers.getInsurance);







module.exports=router;