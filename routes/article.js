var express = require('express');
var router = express.Router();

/* GET home page. */
router
    .get('/article/:id', function (req, res) {
        res.json({id: req.params.id});
    })
    .post('/article/', function (req, res) {
        res.json({id: req.param("id")});
    });

router.get('/article/page/:num', function (req, res) {
    res.json({count: 1})
});
router.get('/article/tags', function (req, res) {
    res.json({count: 1})
});

module.exports = router;
