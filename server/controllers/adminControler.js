require("dotenv").config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const pool = mysql.createPool({
  connectionlimit:10,
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "BiSoN",
  database: process.env.DB_NAME || "SIS",
  port: process.env.DB_PORT || "3305",
  multipleStatements: true
});
exports.mysql =(req, res) => {

    pool.getConnection((err,connection) =>{
            if(err) throw err
            console.log(`connection as id : `+ connection.threadId)
           
            connection.query('SELECT * FROM sakila.actor LIMIT 100', (err,rowsdata1)=>{
                connection.release();
                // console.log(rowsdata1);
                res.render('mysqlsampl',{ content : rowsdata1,  title: 'Nuron'})
                console.log("this is after renderong");
    
            })
    
    
        })
   
    
}
exports.add_user_page =(req, res) => {
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query(`SELECT * FROM sis.role;`, (err,rolldata)=>{
            connection.release();
            if(!err){
            res.render('adduser',{ title: 'Nuron', rolldata:rolldata});
           
            }else{
                console.log(err);
            }
            

        })


    })
    
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
        emp_password:req.body.emp_password
    }
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query('INSERT INTO sis.employee_info SET ?; INSERT INTO sis.employee_credentials SET ?;',[data,data2],(err,rolldata)=>{
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
              sgMail
              .send(msg)
              .then(() => {
                console.log('Email sent sucessfully')
              })
              .catch((error) => {
                console.error(error)
              })
            console.log(msg);
            res.redirect("/admin/view-user");
            }else{
                console.log(err);
                alert("Hello! I am an alert box!");
                res.redirect("/admin/view-user");
            }
            

        })


    })

    }
    
exports.add_role_page =(req, res) => {

        res.render('addrole',{ title: 'Nuron'})
    }
exports.view_user =(req, res) => {
        pool.getConnection((err,connection) =>{
            if(err) throw err
            console.log(`connection as id : `+ connection.threadId)
           
            connection.query("SELECT * FROM sis.employee_info where emp_status = 'Active'; SELECT * FROM sis.role", (err,data)=>{
                connection.release();
                //console.log(employeedata);
                if(!err){
                    res.render('viewuser',{ title: 'Nuron',employeedata:data[0],rolldata:data[1] });

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
           
            connection.query("SELECT * FROM sis.employee_info where emp_id =?;", [req.params.id],(err,empowndata)=>{
                console.log(empowndata);
                if(!err){
                    connection.query("SELECT * FROM sis.employee_info where emp_id =?;", empowndata[0].reporting_manager_id?empowndata[0].reporting_manager_id:0,(err,reportingempowndata)=>{
                        if(!err){
                            connection.query("SELECT * FROM sis.employee_info where reporting_manager_id = ?;", empowndata[0].emp_id?empowndata[0].emp_id:0,(err,childempowndata)=>{

                                connection.release();
                                if(!err){


                    console.log(childempowndata);
                    res.render('complete_user_details',{title: 'Nuron',empowndata:empowndata,reportingempowndata:reportingempowndata,childempowndata:childempowndata})
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


    //createing a controler for the viewing the rols avaiable in the data base
    exports.view_role =(req, res) => {
        pool.getConnection((err,connection) =>{
            if(err) throw err
            console.log(`connection as id : `+ connection.threadId)
           
            connection.query('SELECT * FROM sis.role;', (err,employeerole)=>{
                connection.release();
                //console.log(employeedata);
                res.render('viewrole',{ title: 'Nuron', employeerole:employeerole})
                // res.send(employeerole);
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
                res.redirect("/admin/view-user");
                }else{
                    console.log(err);
                }
    
            })
    
        })

    }



    //this is control for the uploading the data to the databse for the role
    
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
            res.redirect("/admin/view-role");
            }else{
                console.log(err);
            }
            

        })


    })

    }

    exports.data_tranfer =(req, res) => {
       pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and role_name = ?);", [req.params.data],(err,employeerole)=>{
            connection.release();
            res.send(employeerole);
        })


    })

    }

    //getting the detils of a induguval user by using his id 

    exports.edit_user_id =(req, res) => {
        pool.getConnection((err,connection) =>{
         if(err) throw err
         console.log(`connection as id : `+ connection.threadId)
        
         connection.query("SELECT * FROM sis.employee_info where (emp_status = 'Active' and emp_id = ?);", [req.params.id],(err,employeeeditdata)=>{
             connection.release();
             if(!err){
                 console.log(employeeeditdata);
                res.render('editview',{ title: 'Nuron', employeeeditdata:employeeeditdata})
         
            }
           })
 
 
     })
 
     }
 

exports.modify_user =(req, res) => {
        console.log(req.body);
    const data = {
        
            emp_id:req.body.emp_id,
             emp_name : req.body.emp_name,
          emp_email: req.body.emp_email,
          phone_no_1: req.body.phone_no_1,
          phone_no_2: req.body.phone_no_1,
          role_name :  req.body.role_name,
          reporting_manager_name: req.body.emp_repo_manager_name,
          reporting_manager_id: req.body.emp_repo_manager_id,
          emp_status: req.body.emp_status
        
    };
    console.log("data uis asasjkdh ", data);

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`connection as id : `+ connection.threadId)
       
        connection.query(`UPDATE sis.employee_info SET ? WHERE (emp_id = ${[req.body.emp_id]});`,data,(err,rolldata)=>{
            connection.release();
            if(!err){
            console.log(`${req.body.emp_name} has been modifid successfully`);
            res.redirect("/admin/view-user");
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
                res.render('viewuser',{ title: 'Nuron',employeedata:data[0],rolldata:data[1] });

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



     
exports.modify_role =(req, res) => {
    console.log(req.body);
const data = {
    
        role_id:req.body.role_id,
         role_name : req.body.role_name    
};
pool.getConnection((err,connection) =>{
    if(err) throw err
    console.log(`connection as id : `+ connection.threadId)
   
    connection.query(`UPDATE sis.role SET role_name = ? WHERE (role_id = ?);`,[req.body.role_name ,req.params.role_id],(err,rolldata)=>{
        connection.release();
        if(!err){
        console.log(`${req.body.role_name} has been modifid successfully`);
        res.redirect("/admin/view-role");
        }else{
            console.log(err);
        }
        

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
            res.render('viewrole',{ title: 'Nuron', employeerole:data})

        }else{
            console.log(err);
        }
       })


 })

 }



 

 exports.admin_login_check =(req, res) => {

    pool.getConnection((err,connection) =>{
     if(err) throw err
     console.log(`connection as id : `+ connection.threadId)
    
     connection.query("SELECT * FROM sis.employee_credentials WHERE emp_username LIKE ?;", [req.body.emp_user_name], (err,data)=>{
         connection.release();
         if(!err){
            //  res.send(data);
            //  res.send(data[0]);
             console.log(data[0]);
            if(data[0] != undefined){
                if(data[0].emp_password == req.body.emp_password){
                    res.redirect("/admin/view-user");
                }
                else{
                    res.render('admin-home',{ title: 'Nuron',error:"password is worng"});
                }
                
            }else{
                res.render('admin-home',{ title: 'Nuron',error:"user ID not found"})
            }

        }else{
            console.log(err);
        }
    
       })


 })

 }
