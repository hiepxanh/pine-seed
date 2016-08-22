var express = require('express'),
router = express.Router();
router.use('/api/users',require('./users'));

router.get('/', function(req,res){
  res.send(JSON.stringify({message:'Welcome to home!'}))
});

module.exports = router;
