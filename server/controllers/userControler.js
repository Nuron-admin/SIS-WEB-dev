const mysql = require('mysql')

const pool = mysql.createPool({
  connectionlimit:10,
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "BiSoN",
  database: process.env.DB_NAME || "SIS",
  port: process.env.DB_PORT || "3305"
});


exports.view =(req, res) => {



    pool.getConnection((err,connection) =>{
        if(!err) console.log(err);//throw err;

        console.log('connection as id');

        connection.query('SELECT * FROM sakila.actor LIMIT 100', (err,rows) => {
            connection.release();
                    if(!err){
                        
                        res.render('login', { title: 'Nuron',rows});
                    }
                    else{
                        console.log(err);
                    }
                    console.log('the data form user \n', rows);
                   
        });

    });

};


exports.mysql =(req, res) => {

    pool.getConnection((err,connection) =>{
            if(err) throw err
            console.log(`connection as id : `+ connection.threadId)
           
            connection.query('SELECT * FROM sakila.actor LIMIT 100', (err,rowsdata1)=>{
                connection.release();
                // console.log(rowsdata1);
                res.set('layout', './layouts/admin-layout')
                res.render('mysqlsampl',{ content : rowsdata1,  title: 'Nuron'})
    
            })
    
    
        })
   
}
