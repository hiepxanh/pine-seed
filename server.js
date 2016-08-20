'use strict';

var express = require('express');
var fs = require('fs');
var app = express();
var logger = require('./helpers/logger');
var config = require('config');


// run command  set NODE_ENV=production && node server
console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
console.log(config.get('messages'));
console.log(config.get('global'));
// console.log("second:"+process.env.mode)
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
