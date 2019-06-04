/*configs collection model*/
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
let configSchema = new mongoose.Schema({
	order_id : {
		type : Number,
		required : true,
		unique : true,
		delDups : true,
		min : 10000,
		max : 99999
	},  
	color : {
		type : String,
		default : 'red'
	},
	order_quantity : {
		type : Number,
		max : 20,
		default : 1
	}
})
configSchema.plugin(timestamps)
module.exports = mongoose.model('Config',configSchema)