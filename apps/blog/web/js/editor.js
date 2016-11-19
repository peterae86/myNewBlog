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
        input: content
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
$('#save').click(function () {
    var data = {};
    if ($("[name=id]").val()) {
        data['id'] = $("[name=id]").val();
    }
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
            location.href = '/'
        }
    }, 'json');
});

$('#publish').click(function () {
    var data = {};
    if ($("[name=id]").val()) {
        data['id'] = $("[name=id]").val();
    }
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
function paste(str) {

    var tc = document.getElementById("input");
    var tclen = tc.value.length;
    tc.focus();
    if (typeof document.selection != "undefined") {
        document.selection.createRange().text = str;
    }
    else {
        tc.value = tc.value.substr(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
    }
}

document.getElementById("input").addEventListener("paste", function (e) {
    debugger
    if (!(e.clipboardData && e.clipboardData.items)) {
        return;
    }
    var blob = e.clipboardData.items[0].getAsFile()
    if (!blob || blob.size == 0 || blob.type.indexOf("image/") == -1) {
        return
    }
    var formdata = new FormData();
    formdata.append("img", blob);
    $.ajax({
        url: '/upload',
        method: 'post',
        processData: false,
        contentType: false,
        data: formdata,
        async: false,
        success: function (res) {
            if (res && res.status == 200) {
                paste("![](" + res.data + ")");
            }
        }
    });

});



