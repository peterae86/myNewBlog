var css = require("../css/editer.scss")
var Vue = require("vue");
var markdown = require("node-markdown").Markdown;
var Remarkable = require('remarkable');
var md = new Remarkable('commonmark');
new Vue({
    el: '#editor',
    data: {
        input: '# hello'
    },
    filters: {
        marked: function (input) {
            return md.render(input);
        }
    }
});