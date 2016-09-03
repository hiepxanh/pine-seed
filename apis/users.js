var usersFunction = require('./usersFunction');
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
		.post(usersFunction.createUser)
		.get(usersFunction.getUsers);

	apiRouter.route('/users/:page/:limit')
		.get(usersFunction.getUsersPadgination);


	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')
		.get(usersFunction.getUser)
		.put(usersFunction.updateUser)
		.delete(usersFunction.deleteUser);

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};
