var css = require("../css/index.scss");
var Vue = require("vue");
var $ = require("jQuery");

var minId = 1000000;
var time = '';

function getArticle() {
    $.get('/article/list', {num: 10, id: minId}, function (resp) {
        $(".addMore").remove();
        if (resp.data.length > 0) {
            for (var i in resp.data) {
                var article = resp.data[i];
                minId = article.id < minId ? article.id : minId;
                if (time != article.createTime) {
                    $("#articleList").append("<div class='time'>" + article.createTime + "</div>")
                    time = article.createTime;
                }
                if (isLogin) {
                    $("#articleList").append("<div class='articleItem' id='" + article.id + "'><div class='articleTitle'>" + article.title + (article.isPublish == 0 ? "(未发布)" : "") + " <a href='/article/edit/" + article.id + "'>编辑</a>" + "</div><div class='articleAbstract'>" + article.abstract + "</div></div>");
                } else {
                    $("#articleList").append("<div class='articleItem' id='" + article.id + "'><div class='articleTitle'>" + article.title + "</div><div class='articleAbstract'>" + article.abstract + "</div></div>");
                }
            }
            $("#articleList").append("<div class='addMore'>加载更多</div>")
        } else {
            $("#articleList").append("<div class='noMore'>没有更多了</div>")
        }
    }, "json");
}

$("#articleList").on('click', '.addMore', function () {
    getArticle();
});

$("#articleList").on('click', '.articleItem', function () {
    location.href = '/article/' + $(this).attr('id');
});

$(".index").click(function () {
    location.href = '/';
});

getArticle();