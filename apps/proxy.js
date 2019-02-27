var config = require("./config/config");
var proxy = require('./proxy/proxy');
var proxy2 = require('./proxy/httpProxy');
function run() {
    proxy(config.httpsConfig, 8443);
    new proxy2({}).start()
}
module.exports = run;