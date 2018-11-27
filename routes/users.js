var express = require('express');
var router = express.Router();

var answerServices = require('../services/answerServices');
var questionServices = require('../services/questionServices');
var userServices = require('../services/userServices');

/* GET users listing. */
router.get('/', async function(req, res) {
  try {
    let user = await userServices.getById(req.body.id || req.user._id);
    return res.json({
      'status': 'success',
      'data': user
    });
  } catch(e) {
    return res.json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.get('/question', async function(req, res) {
  try {
    let questions = await questionServices.getOne({"_id": req.query.id});
    return res.status(200).json({
      'status': 'success',
      'data': questions
    });
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.get('/questions', async function(req, res) {
  try {
    let questions = await questionServices.get({});
    return res.status(200).json({
      'status': 'success',
      'data': questions
    });
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.post('/question/add', async function(req, res) {
  try {
    if (req.body.hasOwnProperty('title') && req.body.hasOwnProperty('body')) {
      let question = await questionServices.create(req.body.title,req.body.body, req.body.tags, req.user);
      return res.status(200).json({
        'status': 'success',
        'data': question
      }); ;
    } else {
      res.status(422).json({
        'status': 'fail',
        'err': 'title and body fields are mendatory'
      });  
    }
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.post('/question/answer/upvote', async function(req, res) {
  try {
      let answer = await answerServices.upvote(req.body.answer, req.user._id);
      return res.status(200).json({
        'status': 'success',
        'data': answer
      });
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.post('/question/answer/downvote', async function(req, res) {
  try {
    let answer = await answerServices.downvote(req.body.answer, req.user._id);
    return res.status(200).json({
      'status': 'success',
      'data': answer
    }); ;
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.post('/question/answer/checkfav', async function(req, res) {
  try {
    let resp = await req.user.favQuestions.indexOf(req.body.question);
    return res.status(200).json({
      'status': 'success',
      'data': (resp == -1?false:true)
    });
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.post('/question/answer/addfav', async function(req, res) {
  try {
    let user = await userServices.addFav(req.body.question, req.user);
    return res.status(200).json({
      'status': 'success',
      'data': user
    }); ;
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.post('/question/answer/remfav', async function(req, res) {
  try {
    let user = await userServices.remFav(req.body.question, req.user);
    return res.status(200).json({
      'status': 'success',
      'data': user
    }); ;
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

router.get('/question/answer', async function(req, res) {
  try {
    let answers = await answerServices.getAnswerByQuestion(req.query.question);
    return res.status(200).json({
      'status': 'success',
      'data': answers
    }); ;
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});
router.post('/question/answer', async function(req, res) {
  try {
    if (req.body.hasOwnProperty('body') && req.body.hasOwnProperty('question')) {
      let answer = await answerServices.create(req.body.body,req.body.question, req.user._id);
      return res.status(200).json({
        'status': 'success',
        'data': answer
      }); ;
    } else {
      res.status(422).json({
        'status': 'fail',
        'err': 'question and body fields are mendatory'
      });  
    }
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
});

module.exports = router;
