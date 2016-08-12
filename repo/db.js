var sqlite3 = require('sqlite3').verbose();
var fs = require("fs")
var db = new sqlite3.Database('repo/db.sqlite');

console.log(fs.readFileSync('repo/init.sql', 'utf-8'))
// db.run(fs.readFileSync('repo/init.sql', 'utf-8'), function () {
// });
db.run("insert into article(`title`,`abstract`,`markedContent`,`parsedContent`,`createTime`) values ('dsdad','dasda','ssss','xxxxx',DATE('now'));");

module.exports = {
    all: function (sql, params) {
        db.all(sql, params, function (err, res) {
            console.log(res);
            console.log(err);
        });
    }
};