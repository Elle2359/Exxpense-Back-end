const User=require('../models/user');
const Forgotpassword=require('../models/forgotpassword');
const sendmail=require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');


const dotenv = require('dotenv');
dotenv.config();

//forgot password mail
exports.forgotPassword=async(req,res)=>{
  try{
   const mail=req.body.email;
   console.log(mail);
  const user= await User.findOne({where:{email:mail}})
  // console.log(user);
  if(user){
    const id=uuidv4();
    user.createForgotpassword(
      {id:id,
      isactive:true 
      })
    .catch(err=>{
      throw new Error(err);
    })
    const message={   
    to:mail,
    from:'rupeshgante@gmail.com',
    subject:'reset password link',
    text:'Reset your password here',
    html: `<a href="http://localhost:7000/forgot/${id}">Reset password</a>`,
   }
   sendmail.setApiKey(process.env.SENGRID_API_KEY);

   sendmail.send(message)
      .then(response=>{
        res.status(200).json('Reset link sent to email')
      })
      .catch(error=>{
       throw new Error(error);
      })
}
else{
  res.json({success:false,message:'User donot exist'});
}
}
catch(err){
  console.error(err)
 res.status(403).json(err);
}
}

//NEW PASSWORD FORM

exports.resetPassword=async(req,res)=>{
  try{
    console.log('received');
    const id=req.params.id;
    Forgotpassword.findOne({where:{id:id}}).then(forgotrequest=>{
    if(forgotrequest){
      console.log(forgotrequest);
      forgotrequest.update({isactive:false});
      res.status(200).send(`<html>
      <script>
          function formsubmitted(e){
              e.preventDefault();
          }
      </script>
      <form action="/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
      </form>
  </html>`)
                           res.end();
    }
  })
    .catch(err=>{
      console.log(err);
    })  

  }
  catch(err){
    
  }
}

//UPDATE PASSWORD
exports.updatePassword=async(req,res)=>{
  try{
  const newpassword=req.query.newpassword;
  const id=req.params.id;
  Forgotpassword.findOne({ where : { id:id }}).then(forgotrequest => {
    User.findOne({where: { id : forgotrequest.userId}}).then(user => {
        if(user) {

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    user.update({ password: hash }).then(() => {
                        res.status(201).json({message: 'Successfuly update the new password'})
                    })
                });
            });
    } else{
        res.status(404).json({ error: 'No user Exists', success: false})
    }
    })
})
} catch(error){
 res.status(403).json({ error, success: false } )
}

}