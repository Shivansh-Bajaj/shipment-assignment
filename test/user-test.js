var chai = require('chai');
var chaiHttp = require('chai-http');
var db = require('../models/all-models');
var server = require('../app');
var should = chai.should();
var async = require('async');
chai.use(chaiHttp);

describe('user APIs', function() {
  it('signup on /api/v1/signup POST', function(done) {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({'username': 'test', 'password': 'test@123'})
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.equal('success');
      db.User.findOneAndDelete({username: 'test'})
      .then(user => {
        done();
      })
      .catch(err => {
        throw err;
      })
    });
  });
  it(' /api/v1/login POST', function(done) {
      chai.request(server)
      .post('/api/v1/auth/login')
      .send({'username': 'test', 'password': 'test@123'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        // res.body.should.have.property('status');
        res.body.status.should.equal('success');
        res.body.should.have.property('token');
        done();
      });
  });
  it('all questions /api/v1/user/questions GET', function(done) {
    chai.request(server)
    .post('/api/v1/auth/login')
    .send({'username': 'james', 'password': 'james@123'})
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.equal('success');
      res.body.should.have.property('token');
      chai.request(server)
      .get('/api/v1/user/questions')
      .set('Authorization', 'bearer ' + res.body.token)
      .send()
      .end(function(err, res) { 
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        db.Question.find({})
        .then(resp => {
          async.each(res.body.data, (data, done) => {
            let check = resp.filter(element => {
              return element._id.toString() === data._id && element.title.toString() === data.title && element.body.toString() === data.body;
            });
            check.length.should.equal(1);
            done();
          }, (err) => {
            if (err) {
              console.log('fail: ', err);
              done(err);
            } else {
              done();
            }
          });
        }).catch(err => {
          console.log('fail: ', err);
          done(err);
        }); 
      });
    });
  });
  it('filter question tag /api/v1/user/questions GET', function(done) {
    chai.request(server)
    .post('/api/v1/auth/login')
    .send({'username': 'james', 'password': 'james@123'})
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.equal('success');
      res.body.should.have.property('token');
      chai.request(server)
      .get('/api/v1/user/questions?tag=5bfbc190a382d91f3f38e577')
      .set('Authorization', 'bearer ' + res.body.token)
      .send()
      .end(function(err, res) { 
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        db.Question.find({tags: '5bfbc190a382d91f3f38e577'})
        .then(resp => {
          async.each(res.body.data, (data, next) => {
            let check = resp.filter(element => {
              console.log('id',element._id, data._id);
              return element._id.toString() == data._id && element.title.toString() == data.title && element.body.toString() == data.body;
            });
            check.length.should.equal(1);
            next();
          }, (err) => {
            if (err) {
              console.log('fail: ', err);
              done(err);
            } else {
              done();
            }
          });
        }).catch(err => {
          console.log('fail: ', err);
          done(err);
        }) 
      });
    });
  });
  it('add question /api/v1/user/questions POST', function(done) {
    chai.request(server)
    .post('/api/v1/auth/login')
    .send({'username': 'james', 'password': 'james@123'})
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.equal('success');
      res.body.should.have.property('token');
      chai.request(server)
      .post('/api/v1/user/question/add')
      .set('Authorization', 'bearer ' + res.body.token)
      .send({title: 'test question', body: 'test body', tags: {name: 'test'}})
      .end(function(err, res) { 
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        let data = req.body.data;
        console.log(req.body);
        db.Question.findOne({'_id': res.body._id, 'title': 'test question', 'body': 'test body'})
        .then(resp => {
            if (resp) {
              done();
            }
          })
        .catch(err => {
          console.log('fail: ', err);
          done(err);
        })
      }); 
    });
  });
});
