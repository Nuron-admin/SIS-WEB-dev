var jwt = require('jsonwebtoken');
const express = require('express')
const cookies = require("cookie-parser");
const app = express()


app.use(cookies());


module.exports = function(req, res, next) {
    

    const cookies= req.rawHeaders;
    
    if("auth_token" in cookies) {
        console.log("auth_token exist");
    }
    const indexofcookie = cookies.indexOf("Cookie");
    if(indexofcookie !== -1){
    const cookievalue = cookies[indexofcookie+1];


    console.log("the res in cookies in  is ",indexofcookie);
    console.log("the cookies in auth is",cookievalue);

    var cookietruevalue = cookievalue.split("auth_token=");
    var cookietruevalue2 = cookietruevalue[1].split(";");
    console.log("the value of the true cookie is ::",cookietruevalue2[0]);

    if(cookietruevalue2[0]) {
  
    const verify = jwt.verify(cookietruevalue2[0], process.env.TOCKEN_SECRET_KEY,function(err, decoded) {
        if(!err){
            console.log("verify", decoded)
            console.log("moving to next function")
           next();
        }else{
            res.redirect("/");
        }
    
    });
}
    }else{
        res.redirect("/");
    }
    
    
    }