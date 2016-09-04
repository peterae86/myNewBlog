var pushService = require('./service/pushService');

var config = [
    [/\/$/, '/lib/EasePack.min.js', '/lib/html5.js', '/lib/rAF.js', '/lib/TweenLite.min.js', '/javascript/header.js'],
    [/\/article\/\d+$/, '/javascript/article.js']
];

module.exports = function (req, resp, next) {
    for (var i in config) {
        if (config[i][0].test(req.path)) {
            for (var j = 1; j < config[i].length; j++) {
                var path = config[i][j];
                if (!req.cookies['_resource' + path]) {
                    pushService.push(path, resp);
                }
            }
        }
    }
    next();
};