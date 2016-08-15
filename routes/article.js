var express = require('express');
var router = express.Router();
var articleService = require('../service/articleService');

/* GET home page. */
router.get('/article/list', function (req, resp) {
    var num = req.query.num;
    var id = req.query.id;
    var res = articleService.query(num, id);
    resp.json({
        status: 200,
        msg: null,
        data: res
    })
});
router.get('/article/tags', function (req, resp) {
    resp.json({count: 1})
});

router.post('/article/edit', function (req, resp) {
    articleService.save(req.body);
    resp.json({status: 200})
});


router
    .get('/article/new', function (req, resp) {
        resp.render('edit', {title: '施工中'});
    })
    .get('/article/edit/:id', function (req, resp) {
        resp.render('edit', {id: req.params.id});
    })
    .get('/article/:id', function (req, resp) {
        resp.render('article');
    })
    .post('/article/', function (req, resp) {
        resp.json({id: req.param("id")});
    });


module.exports = router;
