const express=require('express');
const authentication=require('../middleware/auth');

const router=express.Router();

const ExpenseController=require('../controllers/expense');

router.post('/addexpense',authentication.authenticate,ExpenseController.addExpense);

router.get('/getexpense',authentication.authenticate,ExpenseController.getExpense);

router.get('/getalluser',authentication.authenticate,ExpenseController.getAllUser);

router.get('/getoneexpense',authentication.authenticate,ExpenseController.getOneExpense);

router.delete('/deleteexpense/:expenseId',authentication.authenticate,ExpenseController.deleteExpense);

router.get('/download',authentication.authenticate,ExpenseController.downloadExpense);

router.get('/previousfiles',authentication.authenticate,ExpenseController.previousFiles);
 
module.exports=router;
 