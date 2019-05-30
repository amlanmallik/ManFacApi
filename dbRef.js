/*Re-using DB connection*/
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.Promise = require('q').Promise
mongoose.Promise = global.Promise
let mongoDB = null
const sapDBurl = 'mongodb://127.0.0.1:27017/sapDB' //DB url

/*exporting DB connection*/
module.exports = {
	init : function(){
		console.log('inside init function')
		mongoose.connect(sapDBurl,{poolSize : 10 , useNewUrlParser : true},function(err,db){
			if(err){
			console.log('error from inside dbRef')
			throw err
		}
			mongoDB = db
			console.log('connected to DB!!')
		})
	},
	
	getcon : function(){
		return mongoDB
	},

	closedb : function(){
		mongoose.connection.close()
	}	
}
