module.exports = function (req, resp, next) {
    if (req.hostname.endsWith('jimu.com')) {
        var cookies = [];
        req.headers.cookie && req.headers.cookie.split(';').forEach(function (Cookie) {
            console.log(Cookie);
            var parts = Cookie.split('=');
            cookies.push(parts[0] + "=" + parts[1] + "; Domain=jimu.com; Path=/")
        });
        resp.writeHead(302, {
            'Location': 'http://lj-05.jimu.com/' + req.url,
            'Set-Cookie': cookies
        });
        resp.end();
        return;
    }
    next();
};