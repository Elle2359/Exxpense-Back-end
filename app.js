const express= require('express');
const app= express();
const cors=require('cors');
//const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const fs=require('fs');
const path=require('path');
const https=require('https');

const bodyParser=require('body-parser');
const sequelize=require('./util/database');

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),
{ 
  flags:'a' 
}); 

// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert');


app.use(cors());
//app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.json({ extended: false }));

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');
const Forgotpassword=require('./models/forgotpassword');
const DownloadedFile=require('./models/downloadedfiles');

User.hasMany(Expense);
Expense.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const passwordRoutes=require('./routes/password');

app.use(userRoutes);
app.use('/user',expenseRoutes);
app.use('/user',purchaseRoutes);
app.use(passwordRoutes);
app.set('views', path.join(__dirname, 'frontend'));
app.set('view engine', 'jade');
app.get('/login', function(req,res) {
    res.render('login',{pageTitle:'Login',layout:false});

});
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})
sequelize
// .sync({force:true})
  .sync()
  .then(res=>{
    // console.log(res);
    app.listen(process.env.PORT || 7000);
  })
  .catch(err => {
    console.log(err);
  });


