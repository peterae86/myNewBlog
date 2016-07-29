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
var proxy = require("spdyproxy")

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
    //   log: log,
    key: fs.readFileSync('./my.key'),
    cert: fs.readFileSync('./my.crt')
}).on('request', function (req, resp) {
    console.log(222)
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
}).on('connect', function (req, socket) {
    var requestOptions = {
        host: req.headers.host.split(':')[0],
        port: req.headers.host.split(':')[1] || 443,
    };
    // if (options.localAddress) {
    //     requestOptions.localAddress = options.localAddress;
    // }

    var tunnel = net.createConnection(requestOptions, function () {
        // socket.writeHead(200,"Connection established",{});
        synReply(socket, 200, 'Connection established',
            {
                'Connection': 'keep-alive',
                'Proxy-Agent': 'SPDY Proxy '
            },
            function () {
                tunnel.pipe(socket);
                socket.pipe(tunnel);
            }
        );
    });

    tunnel.setNoDelay(true);

    tunnel.on('error', function (e) {
        console.log("Tunnel error: ".red + e);
        synReply(socket, 502, "Tunnel Error", {}, function () {
            socket.end();
        });
    });
}).listen(8443, function (err) {
    console.log(err);
});

function synReply(socket, code, reason, headers, cb) {
    try {
        if (socket._handle) {
            socket._handle._spdyState.stream._spdyState.framer.headersFrame(
                {
                    status: 200
                }
            );


            // Chrome used raw SSL instead of SPDY when issuing CONNECT for
            // WebSockets. Hence, to support WS we must fallback to regular
            // HTTPS tunelling: https://github.com/igrigorik/node-spdyproxy/issues/26
        } else {

            var statusLine = 'HTTP/1.1 ' + code + ' ' + reason + '\r\n';
            var headerLines = '';
            for (var key in headers) {
                headerLines += key + ': ' + headers[key] + '\r\n';
            }
            socket.write(statusLine + headerLines + '\r\n', 'UTF-8', cb);
        }
    } catch (error) {
        console.log(error);
        cb.call();
    }
}
module.exports = app;
