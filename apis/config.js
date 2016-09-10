var configFunction = require('./configFunction');
var db = require('../models');
AppConfig = db.AppConfig;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// on routes that end in /api/config
	// ----------------------------------------------------
	apiRouter.route('/config')
		.post(configFunction.createConfig)
		.get(configFunction.getConfig);

	return apiRouter;
};
