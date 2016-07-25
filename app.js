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
var url = require("url");
var log = require("log4js");
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
var fun = function (a) {
    var log2 = log.getLogger(a.component)
    log2.child = fun;
    return log2
};
log.child = fun;

http2.createServer({
             log: log,
        key: fs.readFileSync('./my.key'),
        cert: fs.readFileSync('./my.crt')
    },

    function (req, resp) {
        if (req.method == 'CONNECT') {
            resp.socket.write("HTTP/2 200 Connection established\nProxy-Agent: THE BB Proxy\n\n");
            return;
        }
        req.headers.scheme = "http";
        var options = {
            host: req.host,
            port: 80,
            path: "/",
            headers: req.headers
        };
        var proxyReq = http.request(options, function (res) {
            if (res == null) {
                throw new Error("nima");
            }
            var parsedHeader = {}

            for (var name in res.headers) {
                if (!(name in {
                        'connection': "",
                        'host': "",
                        'keep-alive': "",
                        'proxy-connection': "",
                        'transfer-encoding': "",
                        'upgrade': ""
                    })) {
                    parsedHeader['' + name] = res.headers['' + name]
                }
            }
            resp.writeHead(res.statusCode, parsedHeader);
            res.on('data', function (chunk) {
                resp.write(chunk);
            });
            res.on('end', function () {
                resp.end();
            });

            console.log(req.url);
        });
        req.pipe(proxyReq);
        proxyReq.end();
    }

// function (request, response) {
//     var queryObject = url.parse(request.url, true);
//     if (!queryObject) {
//         response.writeHead(404, "not found");
//         response.end();
//     }
//     else {
//         var proxyUrl = url.parse(queryObject);
//         proxyUrl.method = request.method;
//         proxyUrl.headers = request.headers;
//         proxyUrl.headers["accept-encoding"] = "identity";
//         proxyUrl.headers["referer"] = "";
//         proxyUrl.headers["host"] = url.hostname;
//         proxyUrl.host = request.host;
//
//         var proxy_request;
//
//         proxy_request = http.request(proxyUrl);
//
//
//         proxy_request.on("response", function (proxy_response) {
//
//             response.writeHead(200, proxy_response.headers);
//             console.log("content-type " + proxy_response.headers["content-type"]);
//             if (proxy_response.headers && proxy_response.headers["content-type"] && proxy_response.headers["content-type"].indexOf("text") != -1 && proxy_response.headers["content-type"].indexOf("html") != -1) {
//                 console.log("Turning on html parser.");
//                 var htmlparser = require("htmlparser2");
//                 var handler = require("./nodeHandler");
//                 var Parser = new htmlparser.Parser(handler.handler);
//                 handler.setContext(proxyUrl);
//                 proxy_response.on('data', function (chunk) {
//                     Parser.write(chunk);
//                 });
//                 proxy_response.on('end', function () {
//                     response.write("" + handler.getHTML());
//                     response.end();
//                     Parser.end()
//                     Parser.reset();
//                 });
//
//
//             }
//             else {
//                 console.log("writing binary data");
//                 proxy_response.on('data', function (chunk) {
//                     response.write(chunk, "binary");
//                 });
//                 proxy_response.on('end', function () {
//                     response.end();
//                 });
//             }
//
//
//         });
//
//
//         console.log(proxyUrl);
//
//         request.on('data', function (chunk) {
//             proxy_request.write(chunk, 'binary');
//         });
//         request.on('end', function () {
//             proxy_request.end();
//         });
//     }
// }
).listen(8443, function (err) {
    console.log(err);
});

module.exports = app;
