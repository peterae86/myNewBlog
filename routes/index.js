var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var stream = res.push('/javascript/header.js', {
        status: 200, // optional
        method: 'GET', // optional
        request: {
            accept: '*/*'
        },
        response: {
            'content-type': 'application/javascript'
        }
    });
    stream.on('error', function (err) {
        console.log(err);
    });
    stream.end(fs.readFileSync('web/public/javascript/header.js'));
    res.render('header', {title: '施工中'});
});


module.exports = router;
