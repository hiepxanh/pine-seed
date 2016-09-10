//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let logger = require('../helpers/logger');
let db = require('../models');
User = db.User;
AppConfig = db.AppConfig;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);


//Our parent block
describe('Config', () => {
  let token = null;
  beforeEach((done) => {

      //Before each test we empty the database
      User.remove({},(err)=>{});
      AppConfig.remove({},(err) => {})
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

  describe('/GET to /api/config', function() {

    it('it should GET config', function(done) {
      chai.request(server)
        .get('/api/config')
        .set('x-access-token', token)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
  /*
  * Test the /POST config
  */
  describe('/post to /api/config', function() {

    it('it should POST config', function(done) {
      let config = {blabla:"bleble"};
      chai.request(server)
        .post('/api/config')
        .set('X-access-token', token)
        .send(config)
        .end(function(err, res) {
          // logger.info(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Config created!');
          done();
        });
    });
  });
});
