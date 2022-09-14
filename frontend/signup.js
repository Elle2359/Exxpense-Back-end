const signup=document.getElementById('signup-form');

signup.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=signup.name.value;
    const phone=signup.phone.value;
    const email=signup.email.value;
    const password=signup.password.value;
console.log(name,phone,email,password);
    axios.post('http://localhost:5000/signup',{
        name:name,
        email:email,
        phone:phone,
        password:password
    })
    .then(res=>{
        console.log(res);
        if(res.status==201){
            notifyUser(res.data.message);
//             document.getElementById('name').value='';
// document.getElementById('email').value='';
// document.getElementById('phone').value='';
// document.getElementById('password').value='';
        }
        else{
            console.log()
        }
    })
    .catch(err=>{
        if(err.response){
            notifyUser(err.response);
        }
        // console.log('this is error'+err);
        else{
    notifyUser(err);}
})


})

function notifyUser(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500);
}
