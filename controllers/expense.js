const User=require('../models/user');
const Expense=require('../models/expense');
const AWS=require('aws-sdk');
const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();
const S3Services=require('../services/S3Sservices');
const UserServices=require('../services/userservices');
const DownloadedFile=require('../models/downloadedfiles');

exports.addExpense=(req,res)=>{
    // res.json('received');
    console.log('received expense');
    const {amount,description,catageory}=req.body;
    let total=req.user.totalexpense;
    total=total+(+amount);
    console.log('amount ',total)
    req.user.createExpense({amount,description,catageory})
               .then(expense=>{
                // console.log('useds',req.user.totalexpense);
                req.user.update({totalexpense:total})
                res.status(200).json({expense,success:true});
               })
               .catch(err=>{
                res.status(402).json({error:err,success:false});
               })
}

exports.getExpense=async (req,res)=>{
  // console.log(req);
  const ItemsPerPage=+req.query.rows ||2;
  console.log('Items',ItemsPerPage)
  const page=+req.query.page || 1;
console.log('pageno:'+page);
let totalItems;
  const id=req.user.id;
  console.log('id :',id);
  Expense.count({where:{userId:id}})
       .then(numexpenses=>{
        totalItems=numexpenses;
        console.log('total expenses'+JSON.stringify(totalItems));
        return Expense.findAll({
            where:{userId:id},
            offset:((page-1)*ItemsPerPage),
            limit:ItemsPerPage    
        })
       })
         .then(expenses=>{
          console.log('expenses  '+JSON.stringify( expenses));
          res.json({expenses,
          totalexpenses:totalItems,
          currentPage:page,
          hasNextPage:ItemsPerPage*page<totalItems,
          hasPreviosPage:page>1,
          nextPage:page+1,
          prevPage:page-1,
          lastPage:Math.ceil(totalItems/ItemsPerPage)
          })
         })




    // req.user.getExpenses()
    //           .then(expense=>{
    //             res.status(200).json(expense);
    //           })
    //           .catch(err=>{
    //             res.status(402).json({error:err,success:false});
    //           })
}

exports.getOneExpense=(req,res)=>{
  const id=req.query.user_id;
  Expense.findAll({where:{userId:id}})
     .then(response=>{
         console.log(response);
         res.status(200).json(response);
     })
     .catch(err=>{
      res.status(402).json(err);
     })
}



exports.getAllUser=(req,res)=>{
  User.findAll({
    order: [
      ["totalexpense", "DESC"]
    ]
  })
       .then(user=>{
        // console.log(user)
res.status(200).json(user);
       })
       .catch(err=>{
        res.status(402).json({error:err,success:false});
       })
}

exports.deleteExpense=(req,res)=>{
    const expense=req.params.expenseId;
    let total=req.user.totalexpense;
    // console.log('total : ',total);
    let amount=req.body.amount;
    // console.log('am',amount);
    total=total-amount;
    console.log('total afgter : ',total);

    
    Expense.destroy({where:{id:expense}})
                     .then(()=>{
                      req.user.update({totalexpense:total})
                        res.status(200).json({success:true,message:'successfully deleted'})
                     })
                     .catch(err=>{
                        res.status(403).json({success:false,message:err});
                     })
}

exports.downloadExpense=async(req,res)=>{
  try{
    const expense=await UserServices.getExpense(req);
    console.log(expense);
    const stringifyExpense=JSON.stringify(expense);
    console.log('expense'+stringifyExpense);
    const userId=req.user.id;
    const filename=`expense${userId}/${new Date()}.txt`;
    const url=await S3Services.uploadToS3(stringifyExpense,filename);
    console.log(url);
    req.user.createDownloadedfile({
      url:url   
    }) 
     .then(res=>{
      console.log(res)
     })
    res.status(200).json({success:true,url});
  }
   catch(err){
    console.log(err);
     res.status(500).json({success:false,url:'',error:err})
   }


}

exports.previousFiles=(req,res)=>{
  const id=req.user.id;
  console.log('id :',id);
    req.user.getDownloadedfiles()
              .then(files=>{
                console.log(files);
                res.status(200).json(files);
              })
              .catch(err=>{
                res.status(402).json({error:err,success:false});
              })
}
