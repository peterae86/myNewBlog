var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
module.exports = {
    httpsConfig: {
        key: fs.readFileSync('./my.key'),
        cert: fs.readFileSync('./my.crt')
    },
    argv: argv
};