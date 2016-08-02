var sqlite3 = require('sqlite3').verbose();
var fs = require("fs")
var db = new sqlite3.Database('repo/db.sqlite');

console.log(fs.readFileSync('repo/init.sql', 'utf-8'))
db.run(fs.readFileSync('repo/init.sql', 'utf-8'), function () {
});


module.exports = db;