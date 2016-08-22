'use strict';

var express = require('express');
var fs = require('fs');
var app = express();
var logger = require('./helpers/logger');
var config = require('config');
var bodyParser = require('body-parser');
var yaml = require('js-yaml');
var app = express();
// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// add-on swagger-editor
app.use('/swagger',express.static('./node_modules/swagger-editor'))
app.use('/',express.static('./docs'));
app.get('/docs',function(req,res){
  var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml','utf8'));
  res.send(JSON.stringify(docs));
});
// import routers
app.use(require('./apis'));

// run command  set NODE_ENV=production && node server
console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
console.log(config.get('messages'));
console.log(config.get('global'));

// start server
var server = app.listen(config.get('server.port'), config.get('server.host'), function () {
    var port = server.address().port;
    var host = server.address().address;
    logger.info('Server start at http://%s:%s', host, port);
});

// say hello!!
app.get('/hello', function(req, res){
    res.send(JSON.stringify({'hello': 'world !!!'}));
});
