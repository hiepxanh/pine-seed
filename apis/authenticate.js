var bodyParser = require('body-parser'); 	// get body-parser
var db = require('../models');
User = db.User;
var jwt        = require('jsonwebtoken');
var config     = require('config');
var logger = require('../helpers/logger');

// super secret for creating tokens
var superSecret = config.get("secret");

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to generate sample user
	apiRouter.post('/sample', function(req, res) {

		// look for the user named chris
		User.findOne({ 'username': 'chris' }, function(err, user) {

			// if there is no chris user, create one
			if (!user) {
				var sampleUser = new User();
				sampleUser.name = 'Chris';
				sampleUser.username = 'chris';
				sampleUser.password = 'supersecret';
				sampleUser.email = 'langtumotthoi@gmail.com'
				sampleUser.save(
					function(err) {
						if (err) {
							// duplicate entry
							if (err.code == 11000)
								return res.json({ success: false, message: 'A user with that username already exists. '});
							else
								return res.send(err);
						}

						// return a message
						res.json({ message: 'User sample created!' });
					}
				);
			}
      else {
				// if there is a chris, update his password
				user.password = 'supersecret';
				user.save(
					function(err) {
						if (err) {
							// duplicate entry
							if (err.code == 11000)
								return res.json({ success: false, message: 'A user with that username already exists. '});
							else
								return res.send(err);
						}

						// return a message
						res.json({ message: 'User sample created!' });
					}
				);
			}

		});

	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User
    .findOne({
	    username: req.body.username
	  })
    .select('name username password')
    .exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({
	      	success: false,
	      	message: 'Authentication failed. User not found.'
	    	});
	    }
      else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
        	success: false,
        	message: 'Authentication failed. Wrong password.'
      	});
      }
      else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(
          {
            name: user.name,
            username: user.username
          },
          superSecret,
          {
            expiresIn: '24h' // expires in 24 hours
          }
        );

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		logger.debug('Somebody just came to our app!');
	  // check header or url parameters or post parameters for token
		if (req.get('Authorization') != undefined) {
			logger.debug("They are using Authorization:" + req.get('Authorization'))
	};
	  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get('Authorization');

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      }
        else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;

	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  }
    else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});

	  }
	});


return apiRouter;
}
