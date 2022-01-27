// Imports
const express = require('express')
const ejs = require('ejs');
// const expressLayouts = require('express-ejs-layouts');
const mysql = require('mysql')
const bodyParser = require('body-parser')



const app = express()
const port = 5000
const pool = mysql.createPool({
  connectionlimit:10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})



//sample queue 
// pool.query(`SELECT * FROM sakila.actor LIMIT 100;`, (err,result,filed) =>{
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
//     })

    
// Static Files
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(__dirname+'/public'))


// Set Templating Engine
// app.use(expressLayouts)
// app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')

// Routes
const router = require('./server/routes/user')
app.use('', router);

/*

app.get('/', (req, res) => {

    app.set('layout', './layouts/full-width')
    res.render('login', { title: 'Nuron'})

})
app.get('/mysql', (req, res) => {
   
    // pool.getConnection((err,connection) =>{
    //     if(err) throw err
    //     console.log(`connection as id`)
       
    //     pool.query('SELECT * FROM sakila.actor LIMIT 100', (err,rowsdata1)=>{
    //         connection.release();
    //         // console.log(rowsdata1);
    //         app.set('layout', './layouts/admin-layout')
    //         res.render('mysqlsampl',{ content : rowsdata1,  title: 'Nuron'})

    //     })


    // })
    


})

app.get('/about', (req, res) => {
    res.render('about', { title: 'Nuron', layout: './layouts/sidebar' })
})
app.get('/Home', (req, res) => {
    app.set('layout', './layouts/common-layout')
    res.render('home')
})
app.get('/admin', (req, res) => {
    app.set('layout', './layouts/full-width')
    res.render('admin-home',{ title: 'Nuron'})
})
app.get('/admin/add-user', (req, res) => {
    app.set('layout', './layouts/admin-layout')
    res.render('adduser',{ title: 'Nuron'})
})
app.get('/admin/add-roll', (req, res) => {
    app.set('layout', './layouts/admin-layout')
    res.render('addroll',{ title: 'Nuron'})
})
*/
// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))
