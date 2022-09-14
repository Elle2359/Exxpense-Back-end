const express=require('express');

const router=express.Router();

const pubilcController=require('../controllers/user');
router.get('/signup', function(req,res){
    res.render('signup')
})
router.get('/premium', function(req,res){
    res.render('premium')
})
router.get('/expense', function(req,res){
    res.render('expense')
})
router.get('/report', function(req,res){
    res.render('report',{pageTitle:"Report"})
})
router.post('/signup',pubilcController.postSignup);

router.post('/login',pubilcController.postLogin);


module.exports=router;
  