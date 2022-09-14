const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,

    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:Sequelize.STRING, 
    phone:Sequelize.BIGINT,
    ispremiumuser: Sequelize.BOOLEAN, 
    totalexpense:Sequelize.INTEGER
    
});

module.exports=User;