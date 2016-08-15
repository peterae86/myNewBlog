var db = require('../repo/db');

var articleService = module.exports = {};

articleService.query = function (num, id) {
    return db.all("select * from article where id<:id order by id desc limit :num",
        {":id": id, ":num": num});
};

articleService.save = function (article) {
    if (!article.title || !article.markedContent) {
        throw Error("title or content can not be null")
    }

    if (article.id) {
        db.update("update article set " +
            "title=:title," +
            "abstract=:abstract," +
            "tags=:tags," +
            "markedContent=:markedContent," +
            "parsedContent=:parsedContent," +
            "isPublish=:isPublish where id=:id", {
            ":title": article.title,
            ":abstract": article.abstract,
            ":tags": article.tags,
            ":markedContent": article.markedContent,
            ":parsedContent": article.parsedContent,
            ":isPublish": article.isPublish,
            ":id": article.id
        });
    } else {
        db.insert("insert into article(`title`,`abstract`,`markedContent`,`parsedContent`,`tags`,`isPublish`,`createTime`)" +
            " values (:title,:abstract,:markedContent,:parsedContent,:tags,:isPublish,DATE('now'));", {
            ":title": article.title,
            ":abstract": article.abstract,
            ":tags": article.tags,
            ":markedContent": article.markedContent,
            ":parsedContent": article.parsedContent,
            ":isPublish": article.isPublish
        });
    }
}


