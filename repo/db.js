var sqlite3 = require('sqlite3').verbose();
var fs = require("fs")
var db = new sqlite3.Database('repo/db.sqlite');
var Promise = require('promise');

console.log(fs.readFileSync('repo/init.sql', 'utf-8'))
db.run(fs.readFileSync('repo/init.sql', 'utf-8'), function () {
});

module.exports = {
    all: function (sql, params) {
        return new Promise(function (resolve, reject) {
            db.all(sql, params, function (err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });
    },
    run: function (sql, params) {
        db.run(sql, params, function (err) {
            console.log(err);
        });
    },
    get: function (sql, params) {
        return new Promise(function (resolve, reject) {
            db.get(sql, params, function (err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });
    },
};