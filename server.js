'use strict';

var express = require('express');
var fs = require('fs');
var app = express();
var logger = require('./helpers/logger');
var config = require('config');
var yaml = require('js-yaml');
var app = express();

// add-on swagger-editor
app.use('/swagger',express.static('./node_modules/swagger-editor')); // phuc vu giao dien html
app.use('/',express.static('./docs/index.html')); // dieu huong den thu muc docs va doc file ben trong
app.get('/docs',function(req,res){
  var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml','utf8')); // doc file JSON chua thong tin
  res.send(JSON.stringify(docs));
});

// load every api in one file
var apiRouter = require('./apis')(app,express);
app.use('/api',apiRouter);

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
