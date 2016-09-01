var db = require('../models');
User = db.User;


module.exports = function(app, express) {
  var router = express.Router();

  // testing connection
  router.get('/test', function(req,res){
    res.send(JSON.stringify({message:'Welcome to test link!'}))
  });
  router.post('/testUser', function(req,res){
    // look for the user named chris
		User.findOne({ 'username': 'chris' }, function(err, user) {

			// if there is no chris user, create one
			if (!user) {
				var sampleUser = new User();

				sampleUser.name = 'Chris';
				sampleUser.username = 'chris';
				sampleUser.password = 'supersecret';

				sampleUser.save();
        logger.debug("created a sampleUser" + user);
			} else {
				logger.debug(user);

				// if there is a chris, update his password
				user.password = 'supersecret';
				user.save();
        logger.debug("updated a sampleUser" + user);
			}
    });
	});

  return router;
}
