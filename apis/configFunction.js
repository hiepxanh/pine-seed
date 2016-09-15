var db = require('../models');
AppConfig = db.AppConfig;
let logger = require('../helpers/logger');
cache = require('../helpers/cache');

// get config (accessed at GET http://localhost:8080/api/config)
function getConfig(req, res) {
  // get from cache
   cache.get('AppConfig', function(err, reply) {

     // get from cache first
      if (err) {
        return res.send(err);
      } else if (reply) {
        logger.debug('Get AppConfig from cache');
        return res.send(reply);
      }
     // find AppConfig in Database
      logger.debug('Get AppConfig from database');
      let query = AppConfig.find({});
      query.exec((err,cfg) =>{
        if (err) {return res.send(err);}
        // save to cache
        cache.set('AppConfig', JSON.stringify(cfg));
        res.json(cfg);
      })

   })

}

// create config (accessed at POST http://localhost:8080/api/config)
function createConfig(req,res) {

  var newConfig = new AppConfig(req.body);
  // remove data before insert new config
  let query = AppConfig.remove({});
  query.exec( () => {
    newConfig.save((err,config) => {
      if (err) {return res.send(err)};
      // remove cache AppConfig value
      logger.debug('Remove AppConfig from Cache');
      cache.del('AppConfig');
      res.json({message:"Config created!", config});
    });
  }

  );

}

module.exports = {getConfig,createConfig}
