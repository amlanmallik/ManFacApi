const express = require('express');
const router = express.router();
const DBref = require('../dbRef.js');  //db connectivity
const serializeError = require('serialize-error');  //to serialize error sent via n/w.
let ConfigModel = require('../Models/Config.model.js');  //config schema.
let errorm = require('../errorMsg.js');

router.post('/',function(req,res){
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
});

router.put('/:id',function(req,res){
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
});


module.exports = router;