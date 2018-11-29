const config = require('../config.json');
const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/all-models').User;

/* signup api */
router.post('/signup', async function(req, res) {
  try {
    if (!req.body.hasOwnProperty('username') ||
        !req.body.hasOwnProperty('password') ) {
        return res.status(422).json({
          'status': 'fail',
          'msg': 'fields missing'
        });
    };
    let user = await userModel({
      username: req.body.username,
      password: req.body.password
    }).save();
    return res.json({
      'status': 'success',
      'msg': 'successful created user account'
    })
  } catch(e) {
    return res.json({
      'status': 'error',
      'msg': 'failed',
      'err': e
    });
  }  
});
/* POST login. */
router.post('/login', function (req, res, next) {
  try {
    passport.authenticate('local', {session: false}, (err, user, info) => {
      if (err) {
        return res.status(401).json({
            'status': 'success',
            'message': 'Something is not right',
            'user'   : user
        });
      }
      if (!user) {
        return res.status(401).json({
          'status': 'success',
          'message': 'invalid credential',
          'user'   : user
        });
      }
      req.login(user, {session: false}, (err) => {
        if (err) {
            res.status(403).json({"status": "fail", "error": err});
        }
        // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign({
          username: user.username,
          id: user.id
        }, config.jwtKey);
        return res.json({'user':user, 'token':token, 'status':'success'});
      });
    })(req, res);
  } catch (e){
    return res.status(501).json({
      'status': 'fail',
      'err': e
    })
  }
  
});

module.exports = router;