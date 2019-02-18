var http = require('http');
var server = require('./webserver/server');
function run() {
    http.createServer(server).listen(1180);
}
module.exports = run;