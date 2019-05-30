/*variables & constants*/
const express = require('express') 
const bodyparser = require('body-parser')
const serializeError = require('serialize-error')  //to serialize error sent via n/w.
let count = 0
let app = express()
let DBref = require('./dbRef.js')  //db connectivity
let OrderModel = require('./Order.model.js')  //order schema
let ConfigModel = require('./Config.model.js')  //config schema
let errorm = require('./errorMsg.js')
app.use(bodyparser.json())


/*order_status scheduler starter*/
let scheduler = require('./statusScheduler.js')
scheduler.startScheduler()

app.use('/',function(){
	count = count+1
	next()
	})

/*order_status scheduler terminator*/
app.get('/stopScheduler',function(req,res){
	scheduler.stopScheduler()
	res.send(JSON.parse(errorm.scheduler_stop))
})


/*new order*/
app.post('/order',function(req,res){
	DBref.init()  //connecting to sapDB
	res.contentType("application/json")
	let newOrder = new OrderModel()
	newOrder.order_id = req.body.order_id
	newOrder.order_product = req.body.order_product
	newOrder.save().then(function(data){
		res.send(data)
	}).then(function(data){
		DBref.closedb()
	}).catch(function(error){
		res.status(502)
		res.send(JSON.stringify({"error":serializeError(error["message"])}))
	})
})


/*new configuration*/
app.post('/config',function(req,res){
	DBref.init()
	res.contentType("application/json")
	let data = ''
	let promise = OrderModel.findOne({"order_id":req.body.order_id}).exec()
	promise.then(function(result){
		if(result==null){throw new Error(errorm.no_order)}   //if no order exists.
		if(result.order_config_flag){throw new Error(errorm.new_path)}   //if config already exists.
		if(result.order_status=="closed"){throw new Error(errorm.order_closed)}   //if order is already closed.
		let newConfig = new ConfigModel()
		newConfig.order_id = req.body.order_id
		newConfig.color = req.body.color
		newConfig.order_quantity = req.body.order_quantity
		return newConfig.save()  //saving config data.
	}).then(function(config){
		data = config
		return OrderModel.findOneAndUpdate({"order_id":req.body.order_id},{$set:{"order_config":config._id,"order_config_flag":true}})   //update order based on config.
	}).then(function(result){
		res.send(data)
		console.log('### ALL O.K. ###')
		DBref.closedb()
	}).catch(function(error){
		console.log(error)
		res.status(502)
		res.send(JSON.stringify({"error":serializeError(error["message"])}))
	})
})


/*Updating pre-existing configuration*/
app.put('/config/:id',function(req,res){
	DBref.init()
	res.contentType("application/json")
	let promise = ConfigModel.findOne({"order_id":req.params.id}).exec()
	promise.then(function(result){
		if(result==null){throw new Error(errorm.no_config)}
		let query = ''
		if(req.body.color==null){
			if(req.body.order_quantity==null){throw new Error(errorm.empty_body)}
			else{query={'order_quantity':req.body.order_quantity,'order_quantity':req.body.order_quantity}}
		}
		else{
			query = {'color':req.body.color}
		}
		if(req.body.order_quantity!=null){
			query = {'order_quantity':req.body.order_quantity}
		}
		return ConfigModel.findOneAndUpdate({"order_id":req.params.id},{$set:query},{new:true}) //Updating the Config.
	}).then(function(output){
		res.send(output)
		DBref.closedb()
	}).catch(function(error){
		res.status(502)
		res.send(JSON.stringify({"error":serializeError(error["message"])}))
	})
})


/*defining the server*/
var server = app.listen(3000, function () {
   console.log(server.address().address+'#####'+server.address().port);
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
})



/*# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # | E N D S -- H E R E | # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #*/




/*checking db connection*/
/*app.get('/checkSanity',function(req,res){
	DBref.init()
	console.log('### INSIDE ROUTER ### '+checkOrder('12345'))
	DBref.closedb()	
})*/