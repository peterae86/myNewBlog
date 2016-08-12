var db = require('../repo/db');

var ArticleService = module.exports = {};

ArticleService.query = function (num, id) {
    return db.all("select * from article where id<$id order by id desc limit $num",
        {$id: id, $num: num});
};

