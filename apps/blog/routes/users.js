var express = require('express');
var config = require("../../config/config");
var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, resp) {
    resp.render('login', {title: '登录', id: ""});
});
router.post('/login', function (req, resp) {
    if (req.body.username === config.argv.username && req.body.password === config.argv.password+"") {
        resp.cookie("username", config.argv.username);
        resp.cookie("password", config.argv.password);
        resp.redirect('/');
    }
});


module.exports = router;
