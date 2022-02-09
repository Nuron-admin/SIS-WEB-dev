

document.getElementById("adduserbtnpopup").addEventListener("click",function() {
  let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  document.documentElement.style
    .setProperty('--max-screen-hight-size', `3000px`)

    document.querySelector('.overlayout').style.display = 'flex';

})
document.querySelector(".closeadduser").addEventListener("click",function() {

    document.querySelector('.overlayout').style.display = 'none';
    document.getElementById("adduserfrom").reset();
    document.querySelector('.alert').classList.add("hide_on_start");
    closeallert
    document.getElementById("emp_id_text").style.color = "black";
    document.querySelector(".adduserfrombtn").disabled = false;
    document.getElementById("emp_email_text").style.color = "black";
    document.querySelector(".adduserfrombtn").disabled = false;
})

window.addEventListener('keydown', (e)=> {
    if(e.key =='Escape') {
        document.querySelector('.overlayout').style.display = 'none';
        document.getElementById("adduserfrom").reset();
        document.querySelector('.alert').classList.add("hide_on_start");
    }        
    })
//this psart is to make a drop w for the respective role that we selesct in the add at employee role
document.getElementById("employroll").onchange = () =>{

    var selected_emp_role = document.getElementById("employroll").value;
    console.log(selected_emp_role);
    let value =`<option class="dropedown" selected="selected">None</option>`;
    var get_emp_role;
    switch(selected_emp_role) {
        case "DST":
            get_emp_role= "ASM";
          break;
        case "ASM":
            get_emp_role= "TL";
          break;
        case "TL":
            get_emp_role= "CM";
          break;
          case "CM":
            get_emp_role= "SFH";
         
          break;
          case "SFH":
            get_emp_role= "RH";
          break;
        case "RH":
            get_emp_role= "CEO";
            value =' <option value="NULL" class="dropedown" >NULL</option>';
          break;
          
        default:
         
      }


    fetch(`http://localhost:5000/admin/data-tranfer/${get_emp_role}`)
        .then(res=>res.json())
        .then(data=>{
            
    
            var option = document.getElementById('repomanager');
            

            data.forEach(dat=> {
                value +=`<option value="${dat.emp_id}">${dat.emp_name}</option>`;
            });
            option.innerHTML=value;
        });
};






document.getElementById("repomanager").onchange = () =>{
var selected_repo_manager = document.getElementById("repomanager").value;
console.log(selected_repo_manager);

document.getElementById("repomanagerip").value = selected_repo_manager;

}

document.querySelector('.passiconclick').addEventListener("click",function() {

  console.log("the button was pressdsslkjflkjsdlkfj");


  const password = document.querySelector('#password');
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);

  const icon1 = document.querySelector('.ico1');
  icon1.classList.toggle("passhidden");
  icon1.classList.toggle("pass");
  const icon2 = document.querySelector('.ico2');
  icon2.classList.toggle("pass");
  icon2.classList.toggle("passhidden");
 })


 //generating random password function

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

//creating a randome password 
document.querySelector(".autbtn").addEventListener("click",function() {
  document.getElementById("password").value=makeid(12);
 })

 
function allert(message){
  document.querySelector('.msg').innerHTML=message?message:"error";
             document.querySelector('.alert').classList.add("show");
             document.querySelector('.alert').classList.remove("hide_on_start");
             document.querySelector('.alert').classList.remove("hide");
             document.querySelector('.alert').classList.add("showAlert");
             setTimeout(function(){
               document.querySelector('.alert').classList.remove("show");
               document.querySelector('.alert').classList.add("hide");
             },5000);
 }
 
 function closeallert() {
   console.log("the close allet has been presed")
   document.querySelector('.alert').classList.remove("show");
   document.querySelector('.alert').classList.add("hide");
   }


   //for closing the allert box
document.querySelector(".close-btn").addEventListener("click",closeallert);


    //checking for the duplicates id entered in the front end

 document.getElementById("emp_id").onchange = () =>{
  var selected_emp_id = document.getElementById("emp_id").value;
  if(selected_emp_id !=(null || undefined || "")){
  fetch(`http://localhost:5000/check/id/${selected_emp_id}`,{method: 'POST'})
      .then(res=>res.json())
      .then(data=>{
          if(data.error_code==400 || data.error_code==402){
            allert("Employee ID allready exisit");
            document.getElementById("emp_id_text").style.color = "red";
            document.querySelector(".adduserfrombtn").disabled = true;
          }else if(data.error_code==200){
            closeallert
            document.getElementById("emp_id_text").style.color = "black";
            document.querySelector(".adduserfrombtn").disabled = false;
            
          }
          });
        }
};


//this block of code is to handle the cheking of the existing emp email id 
document.getElementById("emp_email").onchange = () =>{
  var selected_emp_email = document.getElementById("emp_email").value;
  if(selected_emp_email !=(null || undefined || "")){
  fetch(`http://localhost:5000/check/email/${selected_emp_email}`,{method: 'POST'})
      .then(res=>res.json())
      .then(data=>{
          if(data.error_code==400 || data.error_code==402){
            allert("Employee Email allready exisit");
            document.getElementById("emp_email_text").style.color = "red";
            document.querySelector(".adduserfrombtn").disabled = true;
          }else if(data.error_code==200){
            closeallert;
            document.getElementById("emp_email_text").style.color = "black";
            document.querySelector(".adduserfrombtn").disabled = false;
          }
          });
        }
};



// //this block of code is to handle the delet popup

// document.querySelector(".delbtn").addEventListener("click",function(){
//   console.log("the del button has been preseddddddd")
// })