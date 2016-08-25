var bodyParser = require('body-parser');

module.exports = function(app, express) {

  // body parse
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // configure our app to handle CORS requests
  app.use(function(req, res, next) {
  	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  	next();
  });

  // load test API
  var testRouter = require('./test')(app,express);
  app.use('/api',testRouter);
  // load authenticate API
  var authenticateRouter = require('./authenticate')(app,express);
  app.use('/api/',authenticateRouter);
  // load user API
  var userRouter = require('./users')(app,express);
  app.use('/api',userRouter);



  var router = express.Router();
  // testing connection
  router.get('/', function(req,res){
    res.send(JSON.stringify({message:'Welcome to api home!'}))
  });
return router;
}
