// add express module to this file
var express = require('express');

//call router function to work on routing url keywords functions
var router = express.Router();

//add exported files
var userModule=require('../modules/user');

//add bcrypt.js files for encrypting passwords
var bcrypt=require('bcryptjs');


//middleware to check email already exists in the database
function checkEmail(req,res,next){ 
	var email=req.body.email;
	var check_exists_email=userModule.findOne({email:email});
	check_exists_email.exec((err,data)=>{
		if(err) throw err;
		if(data){
			return res.render('signup', { title_1: 'Password Management System',title_2: 'email already exists'});
		}
		next();
	});
}

//middleware to check USERNAME already exists in the database
function checkUsername(req,res,next){ 
	var uname=req.body.uname;
	var check_exists_username=userModule.findOne({username:uname});
	check_exists_username.exec((err,data)=>{
		if(err) throw err;
		if(data){
			return res.render('signup', { title_1: 'Password Management System',title_2: 'username already exists'});
		}
		next();
	});
}


//calling login page
router.get('/login', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('login', { title_1: 'Password Management System',title_2: 'LOGIN FORM' });
});

//calling login page for data post using login form
router.post('/login', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
	
	//get username and password from the login form
	var username=req.body.uname;
	var pswd=req.body.pswd;
	
	//query and execution from mongo db
	var check_user=userModule.findOne({username:username});
	check_user.exec((err,data)=>{
		if(err) throw err;
		
		//get pasword from returned data from database
		var getPassword=data.pswd;
		if(bcrypt.compareSync(pswd,getPassword))
		{
			res.render('login', { title_1: 'Password Management System',title_2: 'user logged in successfully'});
		}
		else
		{
			res.render('login', { title_1: 'Password Management System',title_2: 'invalid username and password'});
		}
	})});

//calling signup page using get method which is not secure
router.get('/signup', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('signup', { title_1: 'Password Management System',title_2: 'PLEASE SIGN UP TO GET ACCESS INTO THE SYSTEM'});
});

//calling signup with post method which is secure and calling middle wares that are defined above
//middleware that are coming first is going to execute first then jump to next middle ware
router.post('/signup',checkEmail,checkUsername,function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
	
//get data from the form and add into variable
var username=req.body.uname;
var email=req.body.email;
var pswd=req.body.pswd;
var c_pswd=req.body.c_pswd;

if(c_pswd!=pswd){
	res.render('signup', { title_1: 'Password Management System',title_2: 'password not matched,please re-type your password'});
}
else{
//encrypt password before get stored in the mongodb database
pswd=bcrypt.hashSync(req.body.pswd,10);


//define which data to which model variables
var userDetails=new userModule({
	username:username,
	email:email,
	pswd:pswd,
});

//save into database and execute function if error
userDetails.save((err,doc)=>{
	if(err) throw err;
	res.render('signup', { title_1: 'Password Management System',title_2: 'user registered successfully'});
})

}

});

//calling password_category page
router.get('/password_category', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('password_category', { title_1: 'Password Management System',title_2: 'PASSWORD CATEGORY'});
});

//calling add_new_category page
router.get('/add_new_category', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('add_new_category', { title_1: 'add new category',title_2: ''});
});

//calling add_new_password page
router.get('/add_new_password', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('add_new_password', { title_1: 'add new password',title_2: ''});
});

//calling view_all_category page
router.get('/view_all_category', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('view_all_category', { title_1: 'add new password',title_2: ''});
});

//calling view_all_category page
router.get('/view_all_password', function(req, res, next) {  //call index.ejs and pass keywords and values mentioned here
  res.render('view_all_password', { title_1: 'View Password Lists',title_2: ''});
});

module.exports = router; //to export to other files