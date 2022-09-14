const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.postSignup=(req,res)=>{
    console.log('post received');
    const saltRounds=10;
    // const name=req.body.name;
    // const email=req.body.email;
    // const phone=req.body.phone;
    // const password=req.body.password;
    const {name, email , phone,password} =req.body;
    bcrypt.genSalt(saltRounds,function(err,salt){
       bcrypt.hash(password,salt,function (err,hash) {
        
     if(err){
        res.json({message:'Unable to create new user'})
     }
const exp=0;
    // console.log(name,email,phone,password);
            User.create({
                name:name,
                email:email,
                phone:phone,
                password:hash,
                totalexpense:exp
            })
            .then(()=>{
                res.status(201).json({success:true,message:'Successfully Signed-Up'})

            })
            .catch(err => {
                res.status(403).json({success:false,message:'Email already registered'})
              })
            })
        })
              
}

function getAccessToken(id) {
    return jwt.sign(id ,process.env.SECRET_TOKEN);
}

exports.postLogin=(req,res)=>{
const {email,password}=req.body;
User.findAll({where:{email}})    
.then(user => {
    if(user.length ==1){
        bcrypt.compare(password, user[0].password, function(err, response) {
            if (err){
            console.log(err)
            return res.json({success: false, message: 'Something went wrong'})
            }
            if (response){
                console.log(JSON.stringify(user.name))
                const jwttoken = getAccessToken(user[0].id);
                res.json({user:user,token: jwttoken, success: true, message: 'Successfully Logged In'})
            } else {
            return res.status(401).json({success: false, message: 'Incorrect Password'});
            }
        });
    } else {
        return res.status(404).json({success: false, message: 'User donot exist'})
    }
})

}





