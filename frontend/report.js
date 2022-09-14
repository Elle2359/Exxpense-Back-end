const download=document.getElementById('download');
const token=localStorage.getItem('token');
const previous=document.getElementById('prev-downloads');
download.addEventListener('click',()=>{
    console.log('clicked');
    axios.get('http://localhost:5000/user/download',{headers:{Authentication:token}})
        .then(res=>{
            if(res.status===200){
var a=document.createElement('a');
a.href=res.data.url;
a.download='myexpense.csv';
a.click();
            }
            else{
                throw new Error(res.data.message);
            }
        })
        .catch(err=>{
            console.log(err);
        })
})

window.addEventListener('DOMContentLoaded',()=>{

    axios.get('http://localhost:5000/user/getexpense',{headers:{Authentication:token}})
    .then(res=>{
        console.log(res);        
        const datee=new Date(res.data.expenses[0].createdAt);
        const month=document.getElementById('month');
        const year=document.getElementById('year');
        year.innerHTML=`${datee.getFullYear()}`
        // console.log(datee.toLocaleString('default', { month: 'long'}));
        month.innerHTML=`${datee.toLocaleString('default', { month: 'long'})}`;
        for(var i=0;i<res.data.expenses.length;i++){
            show(res.data.expenses[i]);
        }
     })
     .catch(err=>{
        console.log(err.message);
     })
})

previous.addEventListener('click',()=>{
    axios.get('http://localhost:5000/user/previousfiles',{headers:{Authentication:token}})
       .then(res=>{
        console.log(res);

        var list = document.getElementById('list-of-files');
        list.innerHTML='';
          for(var i=0; i<res.data.length; i++) {
            var li=document.createElement('li');
            var a=document.createElement('a');
            a.href=`${res.data[i].url}`;
            a.textContent=`File${i+1} `;
            li.appendChild(a);
            console.log(li);
            list.appendChild(li);
            // console.log(list)
            

            }
       })
       .catch(err=>{
        console.log(err);
       })
})


function show(data){
  console.log(data);
    const row=document.getElementById('daily').insertRow();
    var date = row.insertCell(0);
var description = row.insertCell(1);
var cata=row.insertCell(2);
var incom=row.insertCell(3);
var expense=row.insertCell(4);
date.innerHTML=`${data.createdAt}`;
description.innerHTML=`${data.description}`;
cata.innerHTML=`${data.catageory}`;
expense.innerHTML=`${data.amount}`;
}

