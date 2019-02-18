var http2 = require('spdy');
var blog = require('./blog/blog');
var config = require("./config/config");
function run() {
    http2.createServer(config.httpsConfig, blog).listen(1443);
}
module.exports = run;