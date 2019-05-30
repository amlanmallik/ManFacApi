let cron = require('node-cron')
const db = require('./dbRef.js')
const orderModel = require('./Order.model.js')

/*cron expressions*/
const everySaturday10pm = ' 0 0 22 * * SAT * '
const everyMinute = '* * * * *'

/*status-schedular*/ 
let task = cron.schedule(everySaturday10pm,function(){
		db.init()
		orderModel.update({"order_status":"open","order_config_flag":true},{$set:{"order_status":"closed"}},{multi:true},function(err){
			console.log('### UPDATION STARTED ###')
			if(err){
				console.log('scheduler ran in-to error '+err+' ###')
				}
			})
		db.closedb()
		},{scheduled: false}
	)
	
/*scheduler reusing*/
module.exports = {
	startScheduler : function(){task.start()},
	stopScheduler : function(){task.stop()}
}