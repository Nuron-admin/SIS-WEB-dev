const express= require('express');
const router= express.Router();
const userControler = require('../controllers/userControler');
const adminControler = require('../controllers/adminControler');
const authverify = require('../controllers/auth-verify');
const authnotverify = require('../controllers/auth-not-verify');

router.get('/logout',authverify,userControler.logout);
router.get('/',authnotverify,userControler.view);
router.post('/',userControler.user_login_check);
router.get('/forgot-password',userControler.forgotpassword);
router.get('/reset-password',userControler.resetpassword);
router.post('/reset-password/:id',userControler.resetpassword_update);
router.post('/reset-password',userControler.resetpassword_using_email);
router.post('/generateotp',userControler.generateotp);
router.post('/checkotp',userControler.checkotp);

//sample page to port the mysql data 
router.get('/admin/data-tranfer/:data',adminControler.data_tranfer); //1
router.get('/mysql',adminControler.mysql); //2 
router.get('/about', userControler.about); //3

//this block is completely for the user to view edit and delete user as a user(HR)
router.get('/Home',authverify,userControler.Userhome); //1
router.get('/Home/view-user',authverify, userControler.view_user); //1
router.get('/Home/view-user/:id', authverify,userControler.view_user_id); //2
router.get('/Home/edit-user/:id',authverify, userControler.edit_user_id);  //3
router.post('/Home/del-user/:id',authverify, userControler.del_user); //4 main
router.post('/Home/add-user', authverify,userControler.add_user); //5
router.post('/Home/find-user',authverify, userControler.find_user); //6
router.post('/Home/add-user/:id',authverify,userControler.modify_user); //7



//sample try for the del opoup
router.get('/Home/del-user/:id',authverify, userControler.del_user_popup); //4 dummy
//this block is completely for the roleee to view edit and delete user as a user(HR)
router.get('/Home/role', authverify,userControler.view_role); //1
router.post('/Home/role', authverify,userControler.find_role); //2
router.post('/Home/add-role', authverify,userControler.add_role); //3
// router.get('/Home/edit-role/:id', userControler.edit_role_id); //4



//this is completely for the admin to acess tht data 
router.get('/admin', userControler.admin); //1
router.post('/admin', adminControler.admin_login_check); //2

//thi route allows to view the all user form data base to the front webpage

router.get('/admin/view-user', adminControler.view_user); //3
router.post('/admin/view-user', adminControler.find_user); //4
router.get('/admin/view-user/:id', adminControler.view_user_id); //5
router.get('/admin/edit-user/:id', adminControler.edit_user_id); //6
router.post('/admin/add-user', adminControler.add_user); //7
router.get('/admin/del-user/:id', adminControler.del_user); //8
router.post('/admin/add-user/:id',adminControler.modify_user); //9

router.get('/admin/view-role', adminControler.view_role); //10
router.post('/admin/view-role', adminControler.find_role); //11
router.post('/admin/add-role', adminControler.add_role); //12
router.get('/admin/edit-role/:id', adminControler.edit_role_id); //13

/*
//this post method alows to push data to the data base


//page is the front end design of the add user page
// router.get('/admin/add-user', adminControler.add_user_page);

//page is the front end design of the add role page
// router.get('/admin/add-role', adminControler.add_role_page);

//this post method alows to push role data to the data base

*/
//this is for common for all the user and admin where this block helps to ckeck for the existing data in the database
router.post('/admin/add-role/:id',adminControler.modify_role); //1
router.post('/check/id/:id',adminControler.check_emp_id); //2
router.post('/check/email/:email',adminControler.check_emp_email); //3


module.exports = router;

