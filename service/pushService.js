var fs = require('fs');
var zlib = require("zlib");

var pushService = module.exports = {};

var cachedJs = {};
pushService.push = function (url, resp) {
    var stream = resp.push(url, {
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
    if (!cachedJs[url]) {
        cachedJs[url] = zlib.gzipSync(fs.readFileSync('web/public/' + url));
    }
    stream.end(cachedJs[url]);
};