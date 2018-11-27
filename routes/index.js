var express = require('express');
var router = express.Router();
var questionServices = require('../services/questionServices');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tags', async function(req, res) {
  try {
    let tags = await questonServices.getTags({});
    return res.status(200).json({
      'status': 'success',
      'data': tags
    });
  } catch(e) {
    res.status(500).json({
      'status': 'fail',
      'err': JSON.stringify(e)
    });
  }
})

module.exports = router;
