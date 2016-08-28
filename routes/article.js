var express = require('express');
var router = express.Router();
var articleService = require('../service/articleService');
var pushService = require("../service/pushService.js");

/* GET home page. */
router.get('/article/list', function (req, resp) {
    var num = req.query.num;
    var id = req.query.id;
    articleService.query(num, id, req.isLogin).then(function (res) {
        resp.json({
            status: 200,
            msg: null,
            data: res
        })
    }, function (err) {
        console.log(err);
    });
});

router.get('/article/tags', function (req, resp) {
    resp.json({count: 1})
});

router.post('/article/edit', function (req, resp) {
    if (!req.isLogin) {
        throw new Error();
    }
    articleService.save(req.body);
    resp.json({status: 200})
});

router
    .get('/article/new', function (req, resp) {
        if (!req.isLogin) {
            throw new Error();
        }
        resp.render('edit', {id: ""});
    })
    .get('/article/edit/:id', function (req, resp) {
        if (!req.isLogin) {
            throw new Error();
        }
        articleService.queryById(req.params.id).then(function (res) {
            if (res) {
                resp.render('edit', {id: req.params.id, article: res});
            } else {
                throw Error("no article");
            }
        });
    })
    .get('/article/:id', function (req, resp) {
        pushService.push('/javascript/article.js', resp);
        articleService.queryById(req.params.id).then(function (res) {
            if (res) {
                resp.render('article', {article:res});
            } else {
                throw Error("no article");
            }
        });
    });


module.exports = router;
