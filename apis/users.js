var db = require('../models');
User = db.User;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// test route to make sure everything is working
	apiRouter.route('/users/test')
	.get(function(req, res) {
		res.json({message:"oh YEAH users API"})
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')
		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {

			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})
		.get(function(req, res) {
			var limit = (req.params.limit)? parseInt(req.params.limit): 10;
	    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
			User
      .find()
			.then(function(err, users) {
				if (err) res.send(err);
				// return the users
				res.json(users);
			});
		});
		// DONE: pagination bug.
		// get all the users (accessed at GET http://localhost:8080/api/users)
		// support pagination (accessed at GET http://localhost:8080/api/users/1/10)
	apiRouter.route('/users/:page/:limit')
		.get(function(req, res) {
			var limit = (req.params.limit)? parseInt(req.params.limit): 10;
	    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
			User.count({}, function(err, c) {
        User
        .find()
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
				.then(function(err, users) {
					if (err) res.send(err);
					// return the users
					res.json(users);
				});
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {

			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {

			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {

			User.remove({
				_id: req.params.user_id
			}, function(err, user) {

				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};
