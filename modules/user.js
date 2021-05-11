//add mongoose files
const mongoose=require('mongoose'); 

//build connection with mongodb
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex: true}); 

//create connection object 
var conn=mongoose.Collection;

//create model schema manually from the code
var userSchema=new mongoose.Schema({
	username:{type:String,required:true,index:{unique:true}},
	
	email:{type:String,required:true,index:{unique:true}},
	
	pswd:{type:String,required:true},
	
	date:{type:Date,default:Date.now}
	});
	
//creating a collection in mongodb having name->users
var userModel=mongoose.model('users',userSchema);

//export to other file
module.exports=userModel;