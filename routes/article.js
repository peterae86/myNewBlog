var express = require('express');
var router = express.Router();
var articleService = require('../service/articleService');

/* GET home page. */
router
    .get('/article/new', function (req, res) {
        res.render('edit', {title: '施工中'});
    })
    .get('/article/edit/:id', function (req, res) {
        res.json({id: req.params.id});
    })
    .get('/article/:id', function (req, res) {
        res.render('article');
    })
    .post('/article/', function (req, res) {
        res.json({id: req.param("id")});
    });

router.get('/article/page/:num', function (req, res) {
    articleService.query(1, 2);
    res.json({count: 1})
});
router.get('/article/tags', function (req, res) {
    res.json({count: 1})
});

module.exports = router;
