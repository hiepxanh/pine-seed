'use strict';

var express = require('express');
var fs = require('fs');
var app = express();
var logger = require('./helpers/logger');

// run command  set NODE_ENV=production && node server
if (process.env.NODE_ENV !== 'production') {
    console.log("haha it worked! Your are in Production Mode")
}
else if (process.env.NODE_ENV !== 'shit') {
  console.log("haha it worked! Your are in Shit Mode")
}

var server = app.listen('3000', function () {
    var host = server.address().address;
    var port = server.address().port;
    // console.log('Server start at http://%s:%s', '0.0.0.0', 3000);
     logger.info('Server start at http://%s:%s', '0.0.0.0', 3000);
});




// var winston = require('winston');
//
//   winston.log('info', 'Hello distributed log files!');
//   winston.info('Hello again distributed logs');
//
//   winston.level = 'debug';
//   winston.log('debug', 'Now my debug messages are written to console!');




// say hello!!
app.get('/hello', function(req, res){
    res.send(JSON.stringify({'hello': 'world !!!'}));
});
