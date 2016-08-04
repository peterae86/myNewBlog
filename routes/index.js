var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('header', { title: '施工中' });
});


module.exports = router;
