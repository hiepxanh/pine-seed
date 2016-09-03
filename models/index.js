var fs = require('fs'),
path = require('path'),
mongoose = require('mongoose'),
db = {},
config = require('config');

mongoose.Promise = global.Promise;
mongoose.connect(config.get('db'));

//import all file in this dir, except index.js and hidden file start with dot "."
fs.readdirSync(__dirname)
.filter(function(file){
  return (file.indexOf('.') !== 0)  && (file !== 'index.js');
})
.forEach(function(file){
  var model = require(path.join(__dirname,file));
  db[model.modelName] = model;
})

db.mongose = mongoose;
module.exports = db;
