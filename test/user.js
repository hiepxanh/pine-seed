//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let logger = require('../helpers/logger');
let db = require('../models');
User = db.User;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);


//Our parent block
describe('Users', () => {
  let token = null;
  beforeEach((done) => {

    //Before each test we empty the database
      User.remove({},(err)=>{});

      //create new user
      chai.request(server)
          .post('/api/sample')
          .end(function(err, res) {

            // after that, get token
            chai.request(server)
              .post('/api/authenticate')
              .send({name:"Chris",username:"chris",password:"supersecret"})
              .end(function(err, res) {
                token = res.body.token;
                done();
             });
          });

  });

  describe('/GET to /api/users', function() {

    it('it should GET all the users', function(done) {
      chai.request(server)
        .get('/api/users')
        .set('X-access-token', token)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1); // because we already created 1 user to get token !
          done();
        });
    });
  });
  /*
  * Test the /POST route
  */
  describe('/POST to /api/users', () => {
      it('it should not POST a user without users field', (done) => {
        let user = {
            name: "The King",
            username: "boss",
        }
        chai.request(server)
            .post('/api/users')
            .set('X-access-token', token)
            .send(user)
            .end((err, res) => {
                // logger.info(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('password');
                res.body.errors.password.should.have.property('kind').eql('required');
              done();
            });
      });

      it('it should not POST a user if username already exists', (done) => {
        let user = {
            name: "The King",
            username: "chris",
            password:"blabla"
        }
        chai.request(server)
            .post('/api/users')
            .set('X-access-token', token)
            .send(user)
            .end((err, res) => {
                // logger.info(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('A user with that username already exists. ');
              done();
            });
      });

  });

  it('it should POST a user ', (done) => {
        let user = {
          name: "The King",
          username: "Authur",
          password:"blabla"
        }
        chai.request(server)
            .post('/api/users')
            .set('X-access-token', token)
            .send(user)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User created!');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('username');
              done();
            });
  });
  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id to /api/users/:id', () => {
      it('it should GET a user by the given id', (done) => {
        let user = new User({ name:"The Boss",username:"authur",password:"blabla"});
        user.save((err, user) => {
            chai.request(server)
            .get('/api/users/' + user.id)
            .set('X-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('username');
                res.body.should.have.property('_id').eql(user.id);
              done();
            });
        });

      });
  });
  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id to /api/users/:id', () => {
      it('it should UPDATE a user given the id', (done) => {
        let user = new User({name: "The King", username: "Arthur", password:'blabla'})
        user.save((err, user) => {
                chai.request(server)
                .put('/api/users/' + user.id)
                .set('X-access-token', token)
                .send({name: "The Chronicles of Narnia", username: "C.S. Lewis", password:"superblabla"})
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User updated!');
                    res.body.user.should.have.property('name').eql("The Chronicles of Narnia");
                    res.body.user.should.have.property('username').eql("C.S. Lewis");
                  done();
                });
          });
      });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id to /api/users/:id', () => {
      it('it should DELETE a user given the id', (done) => {
        let user = new User({name: "The King", username: "Arthur", password:'blabla'})
        user.save((err, user) => {
                chai.request(server)
                .delete('/api/users/' + user.id)
                .set('X-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully deleted!');
                    res.body.user.should.have.property('ok').eql(1);
                    res.body.user.should.have.property('n').eql(1);
                  done();
                });
          });
      });
  });
});
