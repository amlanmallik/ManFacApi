const express = require('express');
const router = express.router();
let DBref = require('../dbRef.js')  //db connectivity
const serializeError = require('serialize-error')  //to serialize error sent via n/w.
let OrderModel = require('../Models/Order.model.js')  //order schema

router.post('/',function(req,res){
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