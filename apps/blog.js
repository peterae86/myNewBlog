var http2 = require('spdy');
var blog = require('./blog/blog');
var config = require("./config/config");
function run() {
    http2.createServer(config.httpsConfig, blog).listen(4567);
}
module.exports = run;
