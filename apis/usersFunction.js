var db = require('../models');
var q = require('../queues');
User = db.User;

// get all the users (accessed at GET http://localhost:8080/api/users)
function getUsers(req, res) {
  let query = User.find({});
  query.exec((err, users) => {
    if (err) res.send(err);
    // return the users
    res.json(users);
  });
}
// create a user (accessed at POST http://localhost:8080/users)
function createUser(req, res) {

  var newUser = new User(req.body);		// create a new instance of the User model
  newUser.save((err,user) => {
    if (err) {
      // duplicate entry
      if (err.code == 11000) {
        return res.json({ success: false, message: 'A user with that username already exists. '});
      } else {
        return res.send(err);
      }
    } else {
      // remove security attributes
        user = user.toObject();
        if (user) {
            delete user.password;
        }
        // send email welcome to user
        q.create('email', {
            title: '[Site Admin] Thank You',
            to: newUser.email,
          emailContent: {
                username: newUser.username
            },
          template: 'welcome'
        }).priority('high').save();
      // return a message
      res.json({ message: 'User created!',user});
    };

  });

}
// GET users with pagination (accessed at GET http://localhost:8080/api/users/1/10)
function getUsersPadgination (req, res) {
  var limit = (req.params.limit)? parseInt(req.params.limit): 10;
  var skip = (req.params.page)? limit * (req.params.page - 1): 0;
  User.count({}, (err, c) => {
    let query = User.find({})
    .skip(skip)
    .limit(limit)
    .sort({'_id': 'desc'});
    query.exec((err, users) => {
      if (err) res.send(err);
      // return the users
      res.json(users);
    });
  });
}

// get the user with that id
function getUser(req, res) {

  User.findById(req.params.user_id, (err, user) => {
    if (err) res.send(err);
    // return that user
    res.json(user);
  });
}

// update the user with this id
function updateUser (req, res) {

  User.findById(req.params.user_id,(err, user) => {
    if (err) res.send(err);
    // save the user
     Object.assign(user,req.body).save((err,user) => {
      if (err) res.send(err);
      // remove security attributes
        user = user.toObject();
        if (user) {
            delete user.password;
        }
      // return a message
      res.json({ message: 'User updated!',user });
    });

  });
}

// delete the user with this id
function deleteUser(req, res) {

  User.remove({_id: req.params.user_id},(err, user) => {
    if (err) res.send(err);
    res.json({ message: 'User successfully deleted!',user});
  });
}


//export all the functions
module.exports = {getUsers,getUsersPadgination,createUser,getUser,deleteUser,updateUser};
