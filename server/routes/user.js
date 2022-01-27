const express= require('express');
const router= express.Router();
const userControler = require('../controllers/userControler');
const adminControler = require('../controllers/adminControler');

router.get('/',userControler.view);
//sample page to port the mysql data 

router.get('/mysql',adminControler.mysql);

router.get('/about', userControler.about);

router.get('/Home', userControler.Home);


router.get('/admin', userControler.admin);
router.post('/admin', adminControler.admin_login_check);
//thi rout allows to view the all user form data base to the front webpage
router.get('/admin/view-user', adminControler.view_user);
router.post('/admin/view-user', adminControler.find_user);

router.get('/admin/view-user/:id', adminControler.view_user_id);
router.get('/admin/edit-user/:id', adminControler.edit_user_id);
router.get('/admin/view-role', adminControler.view_role);
router.post('/admin/view-role', adminControler.find_role);
//this post method alows to push data to the data base
router.post('/admin/add-user', adminControler.add_user);

//page is the front end design of the add user page
// router.get('/admin/add-user', adminControler.add_user_page);
router.get('/admin/del-user/:id', adminControler.del_user);
//page is the front end design of the add role page
// router.get('/admin/add-role', adminControler.add_role_page);

//this post method alows to push role data to the data base
router.post('/admin/add-role', adminControler.add_role);
router.post('/admin/add-user/:id',adminControler.modify_user);

router.get('/admin/data-tranfer/:data',adminControler.data_tranfer);

router.get('/admin/edit-role/:id', adminControler.edit_role_id);
router.post('/admin/add-role/:id',adminControler.modify_role);


module.exports = router;

