var css = require("../css/editer.scss")
var Vue = require("vue");
var Remarkable = require('remarkable');
var md = new Remarkable('commonmark');
var html = require("../html/tree.html");
var vueScrollbar = require("vue-scrollbar");
var $ = require("jQuery");

// define the item component
Vue.component('item', {
    template: html,
    props: {
        model: Object
    },
    data: function () {
        return {
            open: true
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        changeType: function () {
            if (!this.isFolder) {
                Vue.set(this.model, 'children', [])
                this.open = true
            }
        },
    }
});
var reg = /<h[1-3]>.*?<\/h[1-3]>/g;

var vue = new Vue({
    el: '#editor',
    data: {
        input: '# hello'
    },
    components: {
        'vue-scrollbar': vueScrollbar
    },
    filters: {
        marked: function (input) {
            return md.render(input);
        },
        indexed: function (input) {

            var data = {
                name: 'index',
                children: []
            };
            var ele = input.match(reg);
            var lastH1 = null;
            var lastH2 = null;

            ele && ele.forEach(function (node) {
                var value = node.substring(4, node.length - 5);
                if (node.indexOf("<h1>") != -1) {
                    lastH1 = {name: value, children: []};
                    data.children.push(lastH1);
                }
                if (node.indexOf("<h2>") != -1) {
                    lastH2 = {name: value, children: []};
                    lastH1 && lastH1.children.push(lastH2);
                }
                if (node.indexOf("<h3>") != -1) {
                    lastH2 && lastH2.children.push({name: value});
                }
            });
            return data;
        }
    }
});
console.log(vue);
$('#save').click(function () {
    var data = {};
    data['id'] = $("[name=id]").val();
    data['title'] = $("[name=title]").val();
    data['abstract'] = $("[name=abstract]").val();
    data['tags'] = $("[name=tags]").val();
    data['markedContent'] = vue.input;
    data['parsedContent'] = $("#view").html();
    data['isPublish'] = false;
    $.post('/article/edit', data, function (resp) {
        if (resp.status != 200) {
            alert(resp.msg);
        } else {
            location.href = '/article/saved'
        }
    }, 'json');
});

$('#publish').click(function () {
    var data = {};
    data['id'] = $("[name=id]").val();
    data['title'] = $("[name=title]").val();
    data['abstract'] = $("[name=abstract]").val();
    data['tags'] = $("[name=tags]").val();
    data['markedContent'] = vue.input;
    data['parsedContent'] = $("#view").html();
    data['isPublish'] = true;
    $.post('/article/edit', data, function (resp) {
        if (resp.status != 200) {
            alert(resp.msg);
        } else {
            location.href = '/'
        }
    }, 'json');
});




