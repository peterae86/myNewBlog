var express = require('express');
var fs = require('fs');
var zlib = require("zlib");
var router = express.Router();
var headerjs = zlib.gzipSync(fs.readFileSync('web/public/javascript/header.js'));

/* GET home page. */
router.get('/', function (req, res, next) {
    var stream = res.push('/javascript/header.js', {
        status: 200, // optional
        method: 'GET', // optional
        request: {
            accept: '*/*'
        },
        response: {
            'content-type': 'application/javascript',
            'content-encoding': 'gzip'
        }
    });
    stream.on('error', function (err) {
        console.log(err);
    });
    stream.end(headerjs);
    res.render('header', {title: '施工中'});
});

module.exports = router;
