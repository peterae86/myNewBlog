var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
module.exports = {
    httpsConfig: {
        key: fs.readFileSync('./my.key'),
        cert: fs.readFileSync('./my.crt'),
        spdy: {
            protocols: ['http/1.1'],
            plain: false,

            // **optional**
            // Parse first incoming X_FORWARDED_FOR frame and put it to the
            // headers of every request.
            // NOTE: Use with care! This should not be used without some proxy that
            // will *always* send X_FORWARDED_FOR
            'x-forwarded-for': true,

            connection: {
                windowSize: 1024 * 1024, // Server's window size

                // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
                autoSpdy31: false
            }
        }
    },
    argv: argv
};