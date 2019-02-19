/**
 * Created by peter on 2016/8/1.
 * require node version 6+
 */
var http = require("http");
var https = require("https");
var url = require("url");
var net = require("net");
var http2 = require("spdy");
var deprecatedHeaders = ['connection', 'host', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade'];


var httpsHost = {}

var proxy = function (httpsConfig, port) {//httpsConfig should contains 'key' and 'cert'
    http2.createServer(httpsConfig).on('request', function (req, resp) {
        try {
            var options = {
                host: req.headers.host,
                method: req.method,
                path: req.url,
                headers: req.headers
            };
            console.log('request: '+ JSON.stringify(options));
            var requestType = http;
            if (httpsHost[options.host]) {
                requestType = https;
            }
            var proxyReq = requestType.request(options, function (proxyResp) {
                if (req.isSpdy) {
                    deprecatedHeaders.forEach(function (header) {
                        if (hasHeader(header, proxyResp.headers)) {
                            delete proxyResp.headers[header];
                        }
                    });
                }
                if (proxyResp.statusCode >= 300 && proxyResp.statusCode < 400 && hasHeader('location', proxyResp.headers)) {
                    console.log('redirect: '+options.host);
                    httpsHost[options.host] = 1;
                }
                resp.writeHead(proxyResp.statusCode, proxyResp.headers);
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

            if (!socket._handle._spdyState) {
                console.log('connect: '+requestOptions.host+' type:h1');
                var tunnel = net.createConnection(requestOptions, function () {
                    _synReply(socket, 200, 'Connection established', {
                        },
                        function (error) {
                            if (error) {
                                console.log("syn error", error.message);
                                tunnel.end();
                                socket.end();
                            }
                            tunnel.pipe(socket);
                            socket.pipe(tunnel);
                        }
                    );

                });
                tunnel.setNoDelay(true);
                tunnel.on('error', function (e) {
                    console.log("Tunnel error: ".red + e);
                    socket.end();
                    tunnel.end();
                });
            } else {
                console.log('connect: '+requestOptions.host+' type:h2');
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
            }
        } catch (e) {
            console.log(e);
        }
    }).on('connection', function (socket) {
        console.log('connection');
        this._onConnection(socket);
    }).listen(port, function (err) {
        if (err) {
            console.log(err);
        }
    });
};

function _synReply(socket, code, reason, headers, cb) {
    try {
        var statusLine = 'HTTP/1.1 ' + code + ' ' + reason + '\r\n';
        var headerLines = '';
        for (var key in headers) {
            headerLines += key + ': ' + headers[key] + '\r\n';
        }
        socket.write(statusLine + headerLines + '\r\n', 'UTF-8', cb);
        return;
    } catch (error) {
        debugger
        cb(error);
    }
}

function hasHeader(header, headers) {
    var headers = Object.keys(headers || this.headers)
        , lheaders = headers.map(function (h) {
            return h.toLowerCase()
        })
    ;
    header = header.toLowerCase()
    for (var i = 0; i < lheaders.length; i++) {
        if (lheaders[i] === header) return headers[i]
    }
    return false
}

module.exports = proxy;


