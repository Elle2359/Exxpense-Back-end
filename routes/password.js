const express=require('express');

const router=express.Router();

const passwordController=require('../controllers/password')

router.post('/forgotpassword',passwordController.forgotPassword);

// console.log('reset

router.get('/resetpassword/:id',passwordController.resetPassword);

router.get('/updatepassword/:id',passwordController.updatePassword);

module.exports=router;  