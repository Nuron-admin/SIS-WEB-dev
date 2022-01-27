

document.getElementById("adduserbtnpopup").addEventListener("click",function() {
    document.querySelector('.overlayout').style.display = 'flex';
})
document.querySelector(".closeadduser").addEventListener("click",function() {
    document.querySelector('.overlayout').style.display = 'none';

})

window.addEventListener('keydown', (e)=> {
    if(e.key =='Escape') {
        document.querySelector('.overlayout').style.display = 'none';
    }        
    })
//this psart is to make a drop w for the respective role that we selesct in the add at employee role
document.getElementById("employroll").onchange = () =>{

    var selected_emp_role = document.getElementById("employroll").value;
    console.log(selected_emp_role);
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
          break;
          
        default:
         
      }


    fetch(`http://localhost:5000/admin/data-tranfer/${get_emp_role}`)
        .then(res=>res.json())
        .then(data=>{
            
    
            var option = document.getElementById('repomanager');
            let value =' <option value="NULL" class="dropedown" >NULL</option>';

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


document.querySelector(".autbtn").addEventListener("click",function() {
  document.getElementById("password").value=makeid(12);
 })
