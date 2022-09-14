const jwt=require('jsonwebtoken');
const User=require('../models/user');

exports.authenticate=(req,res,next)=>{
    try{
        // console.log('auth received'+JSON.stringify(req.headers));
        
    const token=req.headers["authentication"];
    console.log('token is : ',token);
    const id=Number(jwt.verify(token,process.env.SECRET_TOKEN));
    console.log(id);
    User.findByPk(id)
                    .then(user=>{
                        req.user=user;
                        next();
                    }) 
                    .catch(err=>{
                        throw new Error(err);
                    })   
} catch(err){
    return res.status(401).json({success:false})
}
}