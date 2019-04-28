var config = require("./config/config");
var proxy = require('./proxy/proxy');
function run() {
    proxy(config.httpsConfig, 8443);
}
module.exports = run;