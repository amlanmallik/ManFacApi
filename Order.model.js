/*orders collection model*/
const mongoose = require('mongoose')
let Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
let orderSchema = new Schema({
	order_id : {
		type : Number,
		required : true,
		unique : true,
		delDups : true,
		min : 10000,
		max : 99999
	},
	order_product : {
		type : String,
		required : true
	},
	order_status : {
		type : String,
		default : 'open'
	},
	order_config : {
		type : Schema.Types.ObjectId,
	},
	order_config_flag : {
		type : Boolean,
		default : false
	}
})
orderSchema.plugin(timestamps)
module.exports = mongoose.model('Order',orderSchema)
