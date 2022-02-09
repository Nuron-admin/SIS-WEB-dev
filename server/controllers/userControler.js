var jwt = require('jsonwebtoken');
require("dotenv").config();
const express = require('express');
const mysql = require('mysql');
var md5 = require('md5');
// const expressLayouts = require('express-ejs-layouts');
const app = express();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



//tried with the express lay out importing hgear
//app.use(expressLayouts)
// app.set('layout', './layouts/ full-width')
// app.set('view engine', 'ejs')

const pool = mysql.createPool({
  connectionlimit:10,
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "BiSoN",
  database: process.env.DB_NAME || "SIS",
  port: process.env.DB_PORT || "3305",
  multipleStatements: true

});

var user_otp=[];


exports.Userhome =  (req, res) => {
    console.log(req.header);
 res.render('home', { title: 'Nuron',title: 'Nuron',error_msg:"nothing",error:false});

                    
};
exports.logout =(req, res) => {

    console.log("the res in logout is ",req);
    const cookies= req.rawHeaders;
    console.log("the res in cookies check for not authin  is ",cookies);
    
    
    const indexofcookie = cookies.indexOf("Cookie");
    console.log("the res in cookies in  is ",cookies[indexofcookie]);

    const cookievalue = cookies[indexofcookie+1];


    console.log("the res in cookies in  is ",indexofcookie);
    console.log("the cookies in auth is",cookievalue);

    var cookietruevalue = cookievalue.split("auth_token=");
    var cookietruevalue2 = cookietruevalue[1].split(";");

    console.log("the value of the true cookie is ::",cookietruevalue2[0]);

    if(cookietruevalue2[0]) {
        console.log("allready an user lloogged in");
        // const tokenresend = jwt.sign(expiresIn: "10h"
        res.cookie('auth_token',"del").redirect("/");
   
}



                    
};
exports.view =(req, res) => {
 res.render('login', { title: 'Nuron',title: 'Nuron',error_msg:"nothing",error:false});

                    
};


exports.about =(req, res) => {
    res.render('about', { title: 'Nuron', layout: './layouts/sidebar' })
}


exports.Home =(req, res) => {
    
    res.render('home',{ title: 'Nuron'})
}


exports.admin =(req, res) => {
    
    res.render('admin-home',{ title: 'Nuron', error:"hideint"})
}


exports.add_roll =(req, res) => {

    res.render('addroll',{ title: 'Nuron'})
}

exports.resetpassword=(req, res) => {

    res.render('forgot-password',{ title: 'Nuron', id: req.body.id})
}
exports.forgotpassword=(req, res) => {

    res.render('forgot_password_uc',{ title: 'Nuron', id: req.params.id})
}


exports.resetpassword_update=(req, res) => {

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
        connection.query(`UPDATE sis.employee_credentials SET emp_password = ? WHERE (emp_id = ?); UPDATE sis.employee_password_check SET password_reset = "false" WHERE (emp_id = ?);`, [md5(req.body.password2),req.params.id,req.params.id], (err,output)=>{
            connection.release();
            if(!err ){
                res.redirect("/home");
            }
            else{
                console.log(err);
            }
        })

    
})
}


exports.user_login_check =(req, res, next) => {

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
        const username= req.body.emp_user_name;
       
        connection.query(`SELECT * FROM sis.employee_credentials where emp_username = ? ; SELECT * FROM sis.employee_info where emp_email = ?;`, [username,username], (err,output)=>{
            if(!err ){
                var data=output[0];
                var check_for_status=null;
                    console.log(output==[]);
                    console.log(output[0]);
                    console.log(typeof data[0] === "object")
                    console.log(typeof output[1][0] === "object")
                    
                    console.log(output[1]==null);

                    if(typeof output[1][0] === "object"){
                        console.log("the output[1] is not null");
                         check_for_status =output[1][0].emp_status;
                    }
                console.log("the o errorr in the session 1");
               if(typeof data[0] === "object"){
                console.log("the input is not null");              
                   if(data[0].emp_password == md5(req.body.emp_password)){
                    console.log("the password is same",md5(req.body.emp_password));

                    if(check_for_status!="Active"){
                        
                        connection.release();
                    
                        res.render('login',{ title: 'Nuron',error_msg:"you are not an active user",error:true})
                        // res.redirect("/home");
                    }else{

                    connection.query("SELECT * FROM sis.employee_password_check WHERE emp_id = ?;", data[0].emp_id, (err1,data1)=>{
                        connection.release();
                        console.log("data1",data1[0]);
                        if(!err1){
                            console.log("emp roleeeee",data1[0]);
                                if(data1[0].emp_role !='RH'){
                                    console.log("this is not hr");
                                    res.render('login',{ title: 'Nuron',error_msg:"you are not allowed to access this page",error:true});
                                }else{
                                    if(data1[0].password_reset=="true"){
                                        console.log("go to forgot passowrd");
                                        res.render('forgot-password',{ title: 'Nuron', id:data1[0].emp_id })
                                    }else{
                                        console.log("go to home page");
                                        const token = jwt.sign({_email:req.body.emp_user_name}, process.env.TOCKEN_SECRET_KEY);
                                        console.log(token);
                                        console.log("created a new token fort heis user");
                                        res.cookie('auth_token',token).redirect("/home");


                                        // res.render('home', { title: 'Nuron',title: 'Nuron',error_msg:"nothing",error:false});
                                        
                                    }
                                    
                                }
                        
                        }else{
                            console.log(err);
                        }
                    })
                }
                   }
                   else{
                    console.log("theend else ineeris same");
                       res.render('login',{ title: 'Nuron',error_msg:"password is worng",error:true});
                   }
                   
               }else{
                console.log("the input is null");
                console.log("the outer elese is same");
                   res.render('login',{ title: 'Nuron',error_msg:"user ID not found",error:true});
               }
        }
        else{
            console.log(err);
        }
    })
   
   
    })


}


exports.view_user =(req, res) => {
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query("SELECT * FROM sis.employee_info where emp_status = 'Active'; SELECT * FROM sis.role", (err,data)=>{
            connection.release();
            //console.log(employeedata);
            if(!err){

               //THis is previous verson before modifying the new view to represnet the data  // res.render('viewuser_uc',{ title: 'Nuron',employeedata:data[0],rolldata:data[1] });
                res.render('viewuser_uc_nw',{ title: 'Nuron',employeedata:data[0],rolldata:data[1] });

            }else{
                console.log(err);
            }
            

        })


    })

   
}




exports.view_user_id =(req, res) => {
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query("SELECT * FROM sis.employee_info where (emp_id =?);", [req.params.id],(err,empowndata)=>{
            console.log(empowndata);
            if(!err){
                connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and emp_id = ?);", empowndata[0].reporting_manager_id?empowndata[0].reporting_manager_id:0,(err,reportingempowndata)=>{
                    if(!err){
                        connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and reporting_manager_id = ?);", empowndata[0].emp_id?empowndata[0].emp_id:0,(err,childempowndata)=>{

                            connection.release();
                            if(!err){


                console.log(childempowndata);
                res.render('complete_user_details_uc',{title: 'Nuron',empowndata:empowndata,reportingempowndata:reportingempowndata,childempowndata:childempowndata})
                    }
                })

            }else{
                console.log(err);
            }
            

        })
    }

    })

})
}



exports.edit_user_id =(req, res) => {
    pool.getConnection((err,connection) =>{
     if(err) throw err
     console.log(`connection as id : `+ connection.threadId)
    
     connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and emp_id = ?);",[req.params.id],(err,employeeeditdata)=>{
        
         if(!err){
           var  selected_emp_role = employeeeditdata[0].role_name;
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
            connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and role_name = ?);",[get_emp_role],(err,data)=>{
                connection.release();
                if(!err){
                    console.log(employeeeditdata);
                   res.render('editview_uc',{ title: 'Nuron', data:data, employeeeditdata:employeeeditdata})
            
               }
              })
       
        }
       })


 })

 }

   //making the user status to be changed to deactivate
   exports.del_user = (req, res)=>{
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query('UPDATE sis.employee_info SET emp_status = "Deactive" WHERE (emp_id = ?);',[req.params.id] ,(err,result)=>{
        connection.release();
            if(!err){
            console.log(`ID ${[req.params.id]} was successfully deleted`);
            res.redirect("/Home");
            }else{
                console.log(err);
            }

        })

    })

}


  //making the user status to be changed to deactivate
  exports.del_user_popup = (req, res)=>{
    res.render('del_uc',{ title: 'Nuron', data:req.params.id});
}




//send grid sending the message to the user
exports.add_user =(req, res) => {
    console.log(req.body);
        const data = {
            
                emp_id:req.body.emp_id,
                 emp_name : req.body.emp_name,
              emp_email: req.body.emp_email,
              phone_no_1: req.body.emp_phone1,
              phone_no_2: req.body.emp_phone2,
              role_name :  req.body.emp_role,
              reporting_manager_name: req.body.emp_repo_manager_name=='NULL'?null:req.body.emp_repo_manager_name,
              reporting_manager_id: req.body.emp_repo_manager_id==''?null:req.body.emp_repo_manager_id
            
        };
        const data2 = {
            emp_id:req.body.emp_id,
            emp_username:req.body.emp_email,
            emp_password:md5(req.body.emp_password)
        }
        const data3 = {
            emp_id:req.body.emp_id,
            emp_role:req.body.emp_role
        }
        pool.getConnection((err,connection) =>{
            if(err) throw err
            console.log(`connection as id : `+ connection.threadId)
           
            connection.query('INSERT INTO sis.employee_info SET ?; INSERT INTO sis.employee_credentials SET ?;INSERT INTO sis.employee_password_check SET ?;',[data,data2,data3],(err,rolldata)=>{
                connection.release();
                if(!err){
                console.log(`The new employe has been created as ${[req.body.emp_name]}`);
                const msg = {
                    to: data.emp_email, 
                    from: 'balagokul@nuron.co.in', 
                    subject: `User ID and Password for the SIS`,
                    text: `Hi ${data.emp_name}, User ID and the password for Sales Infromation System (SIS) application is /n`,
                    html: `<strong style="text-align:center"><ul>Hi ${data.emp_name}, User ID and the password for Sales Infromation System (SIS) application is </ul><ul>User ID: ${data.emp_email}</ul>
                    <ul>Password : ${req.body.emp_password} </ul></strong>`,
                  }
                  sgMail.send(msg)
                  .then(() => {
                    console.log('Email sent sucessfully')
                  })
                  .catch((error) => {
                    console.error(error)
                  })
                console.log(msg);
                res.redirect("/Home");
                }else{
                    console.log(err);
                }
                
    
            })
    
    
        })
    
        }
       

        
     exports.find_user =(req, res) => {
        console.log("this is data tranfer osdsdsdsddsage")
        pool.getConnection((err,connection) =>{
         if(err) throw err
         console.log(`connection as id : `+ connection.threadId)
        
         connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and emp_name LIKE ?);SELECT * FROM sis.role", ["%"+req.body.find+"%"],(err,data)=>{
             connection.release();
             if(!err){
                //  res.send(data);
                res.render('viewuser_uc_nw',{ title: 'Nuron',employeedata:data[0],rolldata:data[1]});

            }else{
                console.log(err);
            }
           })
 
 
     })
 
     }


     

exports.modify_user =(req, res) => {
    console.log(req.body);
const data = {
         emp_name : req.body.emp_name,
      emp_email: req.body.emp_email,
      phone_no_1: req.body.phone_no_1,
      phone_no_2: req.body.phone_no_2,
      role_name :  req.body.role_name,
      reporting_manager_name: req.body.emp_manager_names,
      reporting_manager_id: req.body.emp_manager_id    
};
console.log("data uis asasjkdh ", data);

pool.getConnection((err,connection) =>{
    if(err) throw err
    console.log(`connection as id : `+ connection.threadId)
   
    connection.query(`UPDATE sis.employee_info SET ? WHERE (emp_id = ${[req.body.emp_id]});`,data,(err,rolldata)=>{
        connection.release();
        if(!err){
        console.log(`${req.body.emp_name} has been modifid successfully`);
        res.redirect("/Home");
        }else{
            console.log(err);
        }
        

    })


})   

 }




  //createing a controler for the viewing the rols avaiable in the data base
  exports.view_role =(req, res) => {
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query('SELECT * FROM sis.role;', (err,employeerole)=>{
            connection.release();
            //console.log(employeedata);
            res.render('viewrole_uc',{ title: 'Nuron', employeerole:employeerole})
            // res.send(employeerole);
        })


    })

   
}



 
exports.find_role =(req, res) => {
    pool.getConnection((err,connection) =>{
     if(err) throw err
     console.log(`connection as id : `+ connection.threadId)
    
     connection.query("SELECT * FROM sis.role where role_name LIKE ?", ["%"+req.body.find+"%"],(err,data)=>{
         connection.release();
         if(!err){
            //  res.send(data);             
            res.render('viewrole_uc',{ title: 'Nuron', employeerole:data})

        }else{
            console.log(err);
        }
       })


 })

 }


    
exports.add_role =(req, res) => {

    const roledata = {
            role_id:req.body.role_id,
             role_name : req.body.role_name,
    };
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query('INSERT INTO sis.role SET ?',roledata,(err,rolldata)=>{
            connection.release();
            if(!err){
            console.log(`the new employe has been created as name`);
            res.redirect("/Home/role");
            }else{
                console.log(err);
            }
            

        })


    })

    }


    

    exports.edit_role_id =(req, res) => {
        pool.getConnection((err,connection) =>{
         if(err) throw err
         console.log(`connection as id : `+ connection.threadId)
        
         connection.query("SELECT * FROM sis.role where role_id = ?;", [req.params.id],(err,employeeeditdata)=>{
             connection.release();
             if(!err){
                 console.log(employeeeditdata);
                res.render('editroleview',{ title: 'Nuron', roledataind:employeeeditdata})
            }
           })
 
 
     })
 
     }

     function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
       }
       return result;
      }

     exports.generateotp=(req, res) => {

       var otpgenerated =  makeid(6);

       const msg = {
        to: req.body.email, 
        from: 'balagokul@nuron.co.in', 
        subject: `One time password for SIS`,
        html: `<strong style="text-align:center"><ul>Hi , One time password TOP for Sales Infromation System (SIS) application is </ul><ul>OTP: ${otpgenerated}</ul>
        <ul>Thank you</ul></strong>`,
      }
       // find the user first to resend the otpgenerated
       var finduser = user_otp.find(user_otp =>user_otp.userid === req.body.email);
       if(finduser != undefined)
       {
           //if allready exist delete the data from the user_otp array
           user_otp.splice(user_otp.indexOf(finduser), 1);
       }
     
        user_otp.push({
            vtime: Date.now() + 600000,
            userid: `${req.body.email}`,
            OTP :otpgenerated,
            otpverified: false
          })
          
        //   sgMail.send(msg).then(() => {
                //     console.log('Email sent sucessfully')
                // })
                // .catch((error) => {
                //   console.error(error)
                // })
                  
          console.log(user_otp.find(  user_otp =>user_otp.userid === req.body.email));
          console.log(user_otp);
        res.send({data:"the otp has been send successfully",
                error_code:200});
    }

    //for this check otp you need to pass the bofdy of otp and user id
   
     exports.checkotp=(req, res) => {
       
           const msg = {
            to: req.body.otp, 
            from: 'balagokul@nuron.co.in', 
            subject: `One time password for SIS`,
            html: `<strong style="text-align:center"><ul>Hi , One time password TOP for Sales Infromation System (SIS) application is </ul><ul>OTP:</ul>
            <ul>Thank you</ul></strong>`,
          }
        //   sgMail.send(msg).then(() => {
                //     console.log('Email sent sucessfully')
                // })
                // .catch((error) => {
                //   console.error(error)
                // })


            
    
        //   var checkuser = user_otp.find(user_otp =>user_otp.OTP === req.params.otp);
          var checkuser = user_otp.find(user_otp =>user_otp.userid === req.body.userid);
          
          console.log(checkuser);
          if(checkuser != undefined) {
              
              if(checkuser.OTP ===req.body.otp){
                  if(checkuser.vtime>=Date.now()){
            res.send({data:"the entered OTP is correct",
            error_code:200}); 
            
            user_otp.find(user_otp =>user_otp.userid === req.body.userid).otpverified=true;
            // user_otp.splice(user_otp.indexOf(checkuser), 1);
            }else{
                res.send({data:"OTP has expried click resend OTP",
                error_code:404});
                user_otp.splice(user_otp.indexOf(checkuser), 1);
              }
            }else{
                console.log("Wrong otp");
                res.send({data:"Invalid OTP",
                error_code:406});
            }

          }else {
                res.send({data:"Invalid requestedURL",
                error_code:400});
              }
          

        
    }
    

   

    exports.resetpassword_using_email=(req, res) => {

        console.log(req.body)

        var finduser = user_otp.find(user_otp =>user_otp.userid === req.body.userid);
        console.log(finduser)
        if(finduser.otpverified){
            pool.getConnection((err,connection) =>{
                if(err) throw err
                console.log(`connection as id : `+ connection.threadId)
                connection.query(`UPDATE sis.employee_credentials SET emp_password = ? WHERE (emp_username = ?);`, [md5(req.body.password),req.body.userid], (err,output)=>{
                    connection.release();
                    if(!err ){
                        res.redirect("/");
                    }
                    else{
                        console.log(err);
                    }
                })
        
            
        })

        }else{
            res.send({data:"Invalid requestedURL",
            error_code:400});
        }


       
    }
    