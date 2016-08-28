var express = require('express');
var router = express.Router();
var pushService = require('../service/pushService');

/* GET home page. */
router.get('/', function (req, resp, next) {
    pushService.push('/javascript/header.js', resp);
    resp.render('header', {title: '施工中', isLogin: req.isLogin});
});

module.exports = router;
