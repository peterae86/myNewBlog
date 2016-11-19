module.exports = function (req, resp, next) {
    if (req.hostname.endsWith('backkoms.com')) {
        resp.redirect(['https://', req.hostname, req.originalUrl].join(''));
        return;
    }
    next();
};