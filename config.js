var fs = require("fs");

module.exports = {
    httpsConfig: {
        key: fs.readFileSync('./my.key'),
        cert: fs.readFileSync('./my.crt')
    }
};