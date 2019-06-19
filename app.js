/*variables & constants*/
const express = require('express');
const bodyparser = require('body-parser');
let count = 0;
let app = express();
let orderroute = require('./routes/order');
let configroute = require('./routes/config');
app.use(bodyparser.json());


/*order_status scheduler starter*/
let scheduler = require('./statusScheduler.js')
scheduler.startScheduler()

app.use('/',function(){
	count = count+1;
	next();
	})

/*order_status scheduler terminator*/
app.get('/stopScheduler',function(req,res){
	scheduler.stopScheduler();
	res.send(JSON.parse(errorm.scheduler_stop));
})


/*All order related stuff*/
app.use('/order', orderroute);

/*All configuration related stuff*/
app.use('/config', configroute);


/*defining the server*/
var server = app.listen(3000, function () {
   console.log(server.address().address+'#####'+server.address().port);
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
});