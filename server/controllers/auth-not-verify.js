var jwt = require('jsonwebtoken');
const express = require('express')
const cookies = require("cookie-parser");
const app = express()


app.use(cookies());


module.exports = function(req, res, next) {
    
    const cookies= req.rawHeaders;
    console.log("the res in cookies check for not authin  is ",cookies);
    const indexofcookie = cookies.indexOf("Cookie");    
    if(indexofcookie !== -1){
       

    console.log("the res in cookies in  is ",cookies[indexofcookie+1]);

    const cookievalue = cookies[indexofcookie+1];


    console.log("the res in cookies in  is ",indexofcookie+1);
    console.log("the cookies in auth is",cookievalue);

    var cookietruevalue = cookievalue.split("auth_token=");
    var cookietruevalue2 = cookietruevalue[1].split(";");

    console.log("the value of the true cookie is ::",cookietruevalue2[0]);

    if(cookietruevalue2[0]) {
        console.log("allready an user catch exitsss in");
     
    const verify = jwt.verify(cookietruevalue2[0], process.env.TOCKEN_SECRET_KEY, function (err, data){
if(!err){
    console.log("verify", data)
    res.redirect("/home")
}else{
    console.log("not a valid user exitsss in");
     next();
}
    });
   
}else{
   return res.send("invalid request")
}

    }else{
         next();
    }
}