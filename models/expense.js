const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Expense=sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount:{
        type:Sequelize.DOUBLE,
        allowNull:false, 
    },
    catageory:{
        type:Sequelize.STRING, 
        allowNull:false
    },
    description:Sequelize.STRING    
})

module.exports=Expense;