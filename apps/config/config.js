var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
module.exports = {
    httpsConfig: {
        key: fs.readFileSync('/root/backkoms.com.key'),
        cert: fs.readFileSync('/root/backkoms.crt')
    },
    argv: argv
};