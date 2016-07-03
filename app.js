var express = require('express');
var http2 = require("http2");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var fs = require("fs");
var http = require("http");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http2.createServer({
    key: fs.readFileSync('./my.key'),
    cert: fs.readFileSync('./my.crt')
}, function (req, resp) {
    var options = {
        host: "www.acfun.tv",
        port: 80,
        path: "/",
        method: req.method,
        headers: req.headers
    };
    http.request(options, function (res) {
        if (res == null) {
            throw new Error("nima");
        }
        resp.headers = res.headers;
        res.pipe(resp);
        console.log(req.url);
    }).end();
}).listen(8443, function (err) {
    console.log(err);
});

module.exports = app;
