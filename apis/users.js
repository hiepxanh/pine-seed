var express = require('express'),
db = require('../models'),
router = express.Router();

router.post('/create', function(req,res) {
  var user = new db.User(req.body);
  user.save(function(error,new_user) {
    if (error) {
      return res.status(406).send(JSON.stringify({error}));
    }
    // remove security attributes
    new_user = user.toObject();
    if (new_user) {
            delete new_user.hashed_password;
            delete new_user.salt;
        }
    res.send(JSON.stringify(new_user))
  })
})

module.exports = router;
