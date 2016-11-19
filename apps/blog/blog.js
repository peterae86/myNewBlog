var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require("fs");
var http = require("http");
var url = require("url");
var net = require("net");
var config = require("./../config/config");
var serverPush = require('./serverPush');

var app = express();
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(serverPush);
app.use(function (req, res, next) {
    console.log(req.hostname);
    if (!req.hostname.endsWith("backkoms.com")) {
        res.end();
        return;
    }
    if (req.path.indexOf('javascript') != -1) {
        res.setHeader("Cache-Control", "public, max-age=1800");
        res.setHeader("Expires", new Date(Date.now() + 1800000).toUTCString());
    }
    if (req.cookies.username == config.argv.username && req.cookies.password == config.argv.password + "") {
        req.isLogin = true;
    }
    next();
});
fs.readdirSync('apps/blog/routes').forEach(function (file) {
    app.use('/', require('./routes/' + file))
});
app.use(compression());
app.use(express.static(path.join(__dirname, 'web/public')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
