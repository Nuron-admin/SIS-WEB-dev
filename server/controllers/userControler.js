const express = require('express');
const mysql = require('mysql');
// const expressLayouts = require('express-ejs-layouts');
const app = express();

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
  port: process.env.DB_PORT || "3305"
});


exports.view =(req, res) => {
 res.render('login', { title: 'Nuron'});
                    
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