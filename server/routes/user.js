const express= require('express');
const router= express.Router();
const userControler = require('../controllers/userControler');

router.get('/',userControler.view);
//sample page to port the mysql data 
router.get('/mysql',userControler.mysql);



/*
router.get('/mysql', (req, res) => {
   
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

module.exports = router;