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

// Hiep Hello block
describe('Hiep test routing', () => {
  describe('/GET to /hello', () => {
      it('it should GET 200', (done) => {
        chai.request(server)
            .get('/hello')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
  });
});

//Our parent block
describe('Users', () => {

  beforeEach((done) => {
    //Before each test we empty the database
      User.remove({}, (err) => {
         done();
      });

  });

  describe('/POST to /api/sample',()=>{
      it('It should Created sample user',(done)=>{
        chai.request(server)
           .post('/api/sample')
           .end(function(err, res) {
             res.should.have.status(200);
             done();
           });
      });
  });


  // describe('/POST to /api/authenticate',()=>{
  //   var token = null;
  //   logger.debug('part 1:'+ token);
  //   it('Get token from sample user',(done)=>{
  //     chai.request(server)
  //        .post('/api/authenticate')
  //        .send({name:"Chris",username:"chris",password:"supersecret"})
  //        .end(function(err, res) {
  //          token = res.body.token;
  //          logger.debug('part 2:'+ token);
  //          res.should.have.status(200);
  //          done();
  //          logger.debug('part 3:'+ token);
  //        });
  //   });
  // });

  describe('My API tests', function() {

    var token = null;

    before(function(done) {
      chai.request(server)
        .post('/api/authenticate')
        .send({name:"Chris",username:"chris",password:"supersecret"})
        .end(function(err, res) {
          token = res.body.token; // Or something
          logger.debug(token)
          done();
        });
    });

    it('should get a valid token for users', function(done) {
      chai.request(server)
        .get('/api/users')
        .set('X-access-token', token)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });


});
