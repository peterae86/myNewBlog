var express = require('express');
var http2 = require("spdy");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var fs = require("fs");
var http = require("http");
var url = require("url");
var net = require("net");
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
var array = ['connection', 'host', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade'];
http2.createServer({
    //   log: log,
    key: fs.readFileSync('./my.key'),
    cert: fs.readFileSync('./my.crt')
}).on('request', function (req, resp) {
    try {
        console.log(req.headers.host + req.url);
        var options = {
            host: req.headers.host,
            port: req.port,
            method: req.method,
            path: req.url,
            headers: req.headers
        };
        var proxyReq = http.request(options, function (proxyResp) {
            for (var i = 0; i < array.length; i++) {
                if (proxyResp.headers.hasOwnProperty(array[i])) {
                    delete proxyResp.headers[array[i]];
                }
            }
            resp.writeHead(proxyResp.statusCode, parsedHeader);
            proxyResp.pipe(resp)
        }).on('error', function (e) {
            console.log(e);
            resp.end()
        });
        req.pipe(proxyReq);
    } catch (e) {
        console.log(e);
    }
}).on('connect', function (req, socket) {
    try {
        var requestOptions = {
            host: req.headers.host.split(':')[0],
            port: req.headers.host.split(':')[1] || 443
        };
        console.log(requestOptions.host);
        if (!socket._handle._spdyState) {
            return;
        }
        var tunnel = net.createConnection(requestOptions, function (resp) {
            socket._handle._spdyState.stream.respond(200, {});
            tunnel.pipe(socket);
            socket.pipe(tunnel);
        });
        tunnel.setNoDelay(true);
        tunnel.on('error', function (e) {
            console.log("Tunnel error: ".red + e);
            socket._handle._spdyState.stream.respond(502, {});
            socket.end();
        });
    } catch (e) {
        console.log(e);
    }
}).listen(8443, function (err) {
    console.log(err);
});

module.exports = app;
