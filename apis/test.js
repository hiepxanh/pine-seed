var db = require('../models');
User = db.User;


module.exports = function(app, express) {
  var router = express.Router();

  // testing connection
  router.get('/test', function(req,res){
    res.send(JSON.stringify({message:'Welcome to test link!'}))
  });

  return router;
}
