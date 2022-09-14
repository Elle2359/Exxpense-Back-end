const form=document.getElementById('expense-form');

//ADD EXPENSE
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const amount=form.amount.value;
    const description=form.description.value;
    const catageory=form.catageory.value;
    const expensedetails={
        amount,description,catageory
    }
const token=localStorage.getItem('token');
// console.log(token,amount,description,catageory);

axios.post('http://localhost:5000/user/addexpense',
    expensedetails,
    {headers:{Authentication:token}}
)
.then(res=>{
    alert('Added Expense')
    console.log(res);
    // add(res.data.expense);
})
.catch(err=>{
    console.log(err);
})

})


//GET EXPENSE
const getdata=document.getElementById('get-expense');
const token=localStorage.getItem('token');
getdata.addEventListener('click',()=>{
    const rowno=document.getElementById('rows').value;
    console.log(rowno);
    const row=localStorage.getItem('rows');
    // console.log('row no:',row)
    document.getElementById('rows').value=row;

      axios.get('http://localhost:5000/user/getexpense',{params: { page:1,rows:row },headers:{Authentication:token}})
                 .then(res=>{
                    console.log(res);
                    const expenselist=document.getElementById('listOfExpenses');
                    expenselist.innerHTML='';            
                    for(var i=0;i<res.data.expenses.length;i++){
                        add(res.data.expenses[i]);
                    }
                    const page=document.getElementById('pagination-button');
                    page.innerHTML='';
                    if(res.data.hasPreviosPage){
                        page.innerHTML+=`<button class="pbutton" >${res.data.prevPage}</button>`;

                    }
                    if(res.data.currentPage!=0){
                        page.innerHTML+=`<button class="pbutton" class="active" >${res.data.currentPage}</button>`;
                    }
                    if(res.data.hasNextPage){
                        console.log('next page');
                        page.innerHTML+=`<button class="pbutton" >${res.data.nextPage}</button>`;
                    }
                    if(res.data.lastPage!==res.data.currentPage && res.data.nextPage!==res.data.lastPage)
                    {
                        console.log('last page')
                        page.innerHTML+=`<button class="pbutton" >${res.data.lastPage}</button>`;

                    }


                    document.querySelector('#expense-list').style = "display:block;"
                })
                 .catch(err=>{
                    console.log(err);
                 })
})
//Pagination
const page=document.getElementById('pagination-button');
page.addEventListener('click',(e)=>{
    if(e.target.className=='pbutton'){
        const expenselist=document.getElementById('listOfExpenses');
        expenselist.innerHTML='';
        const pageno=e.target.innerText;
        console.log('pageno:'+pageno);
        
    const rowno=document.getElementById('rows').value;
    localStorage.setItem('rows',rowno);
    const row=localStorage.getItem('rows');
    console.log('no of rows:',row)

    axios.get('http://localhost:5000/user/getexpense',{params: { page:pageno,rows:row },headers:{Authentication:token}})
        // axios.get(`http://localhost:7000/user/getexpense/${pageno}`,{headers:{Authentication:token}})
           .then(res=>{
            console.log(res);
           
           // console.log(data);
           for(var i=0;i<res.data.expenses.length;i++){
            add(res.data.expenses[i]);
        }
        const page=document.getElementById('pagination-button');
                    page.innerHTML='';
                    if(res.data.hasPreviosPage){
                        page.innerHTML+=`<button class="pbutton" >${res.data.prevPage}</button>`;

                    }
                    if(res.data.currentPage!=0){
                        page.innerHTML+=`<button  class="active" >${res.data.currentPage}</button>`;
                    }
                    if(res.data.hasNextPage){
                        // console.log('next page');
                        page.innerHTML+=`<button class="pbutton" >${res.data.nextPage}</button>`;
                    }
                    if(res.data.lastPage!==res.data.currentPage && res.data.nextPage!==res.data.lastPage)
                    {
                        // console.log('last page')
                        page.innerHTML+=`<button class="pbutton" >${res.data.lastPage}</button>`;

                    }


        document.querySelector('#expense-list').style = "display:block;"
    })
     .catch(err=>{
        console.log(err);
     })
    }
})

function add(data){
    var listOfExpenses=document.getElementById('listOfExpenses');
    var li=document.createElement('li');
    li.appendChild(document.createTextNode(`Amount : ${data.amount}  ||  Description : ${data.description}  ||  Catageory : ${data.catageory}`));
    // var edit=document.createElement('input');
    // edit.id='edit';
    // edit.value='EDIT';
    // edit.type='button';
    // edit.style.border="2px solid green";
    // li.appendChild(edit);
//     edit.addEventListener('click',async ()=>{
//         try{
//         var a=document.getElementById('amount');
//         var d=document.getElementById('description');
//         var c=document.getElementById("catageory");
//         a.value=data.amount;
//         d.value=data.description;
//         c.value=data.catageory;
//         await axios.delete(`https://crudcrud.com/api/f7a3df4f0bef4671866ffb2c06286286/ExpenseData/${data._id}`)
//              li.remove();
//         }
//     catch(err){
//    console.log(err);
//     }
//     })

//DELETE EXPENSE
    var del=document.createElement('input');
    del.id='delete';
    del.value='DELETE';
    del.type='button';
    li.appendChild(del)
    del.addEventListener('click',async()=>{
        try{
        await axios.delete(`http://localhost:5000/user/deleteexpense/${data.id}`,{headers:{Authentication:token},data:{amount:data.amount}})
             li.remove();
        }
        catch(err){
            console.log(err);
        }
})
    listOfExpenses.appendChild(li);
    }

//PREMIUM MEMBERSHIP

    var premium=document.getElementById('premium-membership');
    premium.addEventListener('click',async(e)=>{
        e.preventDefault();
        const token=localStorage.getItem('token');
        console.log('token :',token);
        const response= await axios.get('http://localhost:5000/user/premiummembership',{headers:{Authentication:token}});
        var options=
        {
            "key":response.data.key_id,
            "name":"Test Company",
            "order_id":response.data.order.id,
            "prefill":{
                "name":"TEST USER",
                "email":"test@email.com",
                "contact":"9963251062"
            },
            "theme":{
                "color":"#3399c"
            },
            "handler":function(response){
                console.log('sent');
                axios.post('http://localhost:5000/user/updatetransaction',{
                    order_id : options.order_id,
                    payment_id : response.razorpay_payment_id,
            
          },{headers:{Authentication:token}}
          ).then(()=>{
            // document.body.style.background='linear-gradient(45deg,#cee3e2,#e7bd32)';
            // const premium=document.getElementById('form');
            // premium.style.background='linear-gradient(45deg,#cee3e2,#32e7e7)';
            alert('You are a Premium Member Now');
            localStorage.setItem('premium',1);
            window.location.replace('./premium')
            // premium.classList.add('active');

          }).catch(()=>{
            alert('Something went wrong');
          })
            }
        }
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
      
        rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
       });
    })


    // Leaderboard
if(localStorage.getItem('premium')==1){
    const leaderboard=document.getElementById('board')

    leaderboard.addEventListener('click',(e)=>{
        if(e.target.className=='leaderboard-holder')
        {
            axios.get('http://localhost:5000/user/getalluser',{headers:{Authentication:token}})
            .then(res=>{
                const data=res.data;
                console.log('leaderboard data: '+JSON.stringify(data));
                  showBoard(data);
                  document.querySelector('#leaderboard').style = "display:block;"
                })
                .catch(err=>console.log(err));
              
        }
        if (e.target.className=='cancel'){
            document.querySelector('#leaderboard').style = "display:none";
            document.querySelector('.leaderboard-items').innerHTML = '';

            
        }
    })


// SHOWING LEADER BOARD
    function showBoard(data){
        if(    document.querySelector('#leaderboard').style = "display:block;"){
            document.querySelector('.leaderboard-items').innerHTML = '';
        }
    const leaderboard_items = document.querySelector('#leaderboard .leaderboard-items');
    let i=0;
    data.forEach(user=>{
        i++;
        const leaderboard_item = document.createElement('div');
        leaderboard_item.classList.add('leaderboard-row');
        leaderboard_item.setAttribute('id',`${user.id}`);
        leaderboard_item.innerHTML = `
                <span class='leaderboard-item leaderboard-column'>
                    <span class='leaderboard-rank leaderboard-column'>${i}</span>
                     <span >
                     <a href='#user class='leaderboard-name leaderboard-column' onclick='display(${user.id})' >${user.name}</a>
                     </span>
                        <span class='leaderboard-totalexpense leaderboard-column'>${user.totalexpense}</span>
                </span>`
        leaderboard_items.appendChild(leaderboard_item);
    })
    
    }


    //PREMIUM USER FEATURE 

   function display(id){
    console.log('ss',id);
    data = {
        "user_id":id
      }
    axios.get('http://localhost:5000/user/getoneexpense',{params: { user_id:id },headers:{Authentication:token}})
    .then(res=>{
        console.log(res);
        for(var i=0;i<res.data.length;i++){
            add(res.data[i]);
        }
        document.querySelector('#expense-list').style = "display:block;"

     })
     .catch(err=>{
        console.log(err);
     })

    }
}
    //LOGOUT

    const logout=document.getElementById('logout');
    logout.addEventListener('click',()=>{
        localStorage.clear();
        window.location.replace('./login')

    })