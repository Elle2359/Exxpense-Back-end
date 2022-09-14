const razorpay=require('razorpay');

const Order=require('../models/order');

exports.purchasepremeium=async(req,res)=>{
try{
    var rzp=new razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    })
    const amount=100;

    rzp.orders.create({amount,currency:'INR'},(err,order)=>{
        if(err){
            throw new Error(err);
        }
        req.user.createOrder({orderid:order.id,status:'PENDING'})
              .then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id});
              })
              .catch(err=>{
                throw new Error(err);
              })
    })
}catch(err){
    res.status(403).json({message:'something is wrong',error:err});
}
}

exports.updateTransaction=async(req,res)=>{
    try{
        console.log('payment received');
        const {payment_id,order_id}=req.body;
        Order.findOne({where:{orderid:order_id}}).then(order=>{
            req.user.update({ispremiumuser:true})
            order.update({status:'DONE'})
            return res.status(202).json({success:true,message:'Transaction Successfull'});
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){
        res.status(403).json({error:err,message:'Somethin went wrong'})
    }
}
   