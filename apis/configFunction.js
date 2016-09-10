var db = require('../models');
AppConfig = db.AppConfig;

// get config (accessed at GET http://localhost:8080/api/config)
function getConfig(req, res) {
  let query = AppConfig.find({});
  query.exec((cfg,err) =>{
    if (err) {return res.send(err);}
    res.json(cfg);
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
      res.json({message:"Config created!", config});
    });
  }

  );
}

module.exports = {getConfig,createConfig}
