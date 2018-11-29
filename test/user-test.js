var chai = require('chai');
var chaiHttp = require('chai-http');
var db = require('../models/all-models');
var server = require('../app');
var should = chai.should();
var async = require('async');
chai.use(chaiHttp);

var token = "";
var questionId = "";
var answerId = "";
var username = "test";
var password = "test@123";
var questionTitle = "test question title";
var questionBody = "test question test";
var answerBody = "test answer text";
var questionTag = [{
  "name": "test" 
}];

describe('user APIs', function() {
  // signup new account
  it('signup on /api/v1/signup POST', function(done) {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({'username': username, 'password': password})
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.equal('success');
      done();
    });
  });
  // login account
  it(' /api/v1/login POST', function(done) {
      chai.request(server)
      .post('/api/v1/auth/login')
      .send({'username': 'test', 'password': 'test@123'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.status.should.equal('success');
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        token = res.body.token;
        done();
      });
  });
  // add question
  it('add question /api/v1/user/questions/add POST', function(done) {
    chai.request(server)
      .post('/api/v1/user/question/add')
      .set('Authorization', 'bearer ' + token)
      .send({title: questionTitle, body: questionBody, tags: questionTag})
      .end(function(err, res) { 
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        questionId = res.body.data._id;
        db.Question.findOne({'_id': questionId})
        .then(resp => {
          should.not.equal(resp, null);            
          resp.should.has.property("_id");
          resp.title.should.equal(questionTitle);
          resp.should.has.property("body");
          resp.body.should.equal(questionBody);
          done();
          
        })
        .catch(err => {
          should.equal(err, null);
          done();
        });
      }); 
    });
    // add answer
    it('add answer /api/v1/user/question/answer/ POST', function(done) {
      chai.request(server)
        .post('/api/v1/user/question/answer')
        .set('Authorization', 'bearer ' + token)
        .send({body: answerBody, question: questionId})
        .end(function(err, res) { 
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.status.should.equal('success');
          res.body.data.should.have.property('_id');
          answerId = res.body.data._id;
          db.Answer.findOne({'_id': answerId})
          .then(resp => {
            should.not.equal(resp, null);            
            resp.should.has.property("_id");
            resp.should.has.property("body");
            resp.body.should.equal(answerBody);
            done();
          })
          .catch(err => {
            console.log('fail: ', err);
            should.equal(err, null);
            done(err);
          });
        }); 
      });
      // upvote answer
    it('upvote answer /api/v1/user/question/answer/upvote POST', function(done) {
      chai.request(server)
        .post('/api/v1/user/question/answer/upvote')
        .set('Authorization', 'bearer ' + token)
        .send({answer: answerId})
        .end(function(err, res) { 
          res.should.have.status(200);
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.status.should.equal('success');
          db.Answer.findOne({'_id': answerId})
          .then(resp => {
            should.not.equal(resp, null);            
            resp.should.have.property('votes');
            resp.votes.should.equal(1);
            done();
          })
          .catch(err => {
            console.log('fail: ', err);
            done(err);
          });
        }); 
      });
      // downvote answer
      it('downvote answer /api/v1/user/question/answer/downvote POST', function(done) {
        chai.request(server)
          .post('/api/v1/user/question/answer/downvote')
          .set('Authorization', 'bearer ' + token)
          .send({answer: answerId})
          .end(function(err, res) { 
            res.should.have.status(200);
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            res.body.status.should.equal('success');
            db.Answer.findOne({'_id': answerId})
            .then(resp => {
              should.not.equal(resp, null);            
              resp.should.have.property('votes');
              resp.votes.should.equal(0);
              done();
            })
            .catch(err => {
              console.log('fail: ', err);
              done(err);
            });
          }); 
        });
    
  // get questions
  it('all questions /api/v1/user/questions GET', function(done) {
    chai.request(server)
    .get('/api/v1/user/questions')
    .set('Authorization', 'bearer ' + token)
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
  it('filter question tag /api/v1/user/questions GET', function(done) {
      chai.request(server)
      .get('/api/v1/user/questions?tag=5bfbc190a382d91f3f38e577')
      .set('Authorization', 'bearer ' + token)
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
        }); 
      });
  });
  // add favourite
  it('add favourite question  /api/v1/user/question/addfav POST', function(done) {
    chai.request(server)
      .post('/api/v1/user/question/addfav')
      .set('Authorization', 'bearer ' + token)
      .send({'question': questionId})
      .end(function(err, res) { 
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        db.User.findOne({username: username})
        .then(resp => {
          should.not.equal(resp, null);
          resp.should.have.property('favQuestions');
          let index = resp.favQuestions.indexOf(questionId);
          should.not.equal(index, -1);
          done();
        }).catch(err => {
          console.log('fail: ', err);
          should.not.equal(err, null);
          done(err);
        }); 
      });
  });
  // remove favourite
  it('remove favourite question  /api/v1/user/question/remfav POST', function(done) {
    chai.request(server)
      .post('/api/v1/user/question/remfav')
      .set('Authorization', 'bearer ' + token)
      .send({'question': questionId})
      .end(function(err, res) { 
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        db.User.findOne({username: username})
        .then(resp => {
          should.not.equal(resp, null);
          resp.should.have.property('favQuestions');
          let index = resp.favQuestions.indexOf(questionId);
          should.equal(index, -1);
          done();
        }).catch(err => {
          console.log('fail: ', err);
          should.not.equal(err, null);
          done(err);
        });
      });
  });
  // delete all test data
  it('delete data', async function() {
    try {
    await db.User.findOneAndDelete({"username": username});
    await db.Question.findOneAndDelete({"_id": questionId});
    await db.Answer.findOneAndDelete({"_id": answerId});
    await db.Tag.deleteMany(questionTag[0]);
    return;
    } catch(e) {
      throw e;
    }
  });
});
  