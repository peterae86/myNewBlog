var css = require("../css/article.scss");
var html = require("../html/tree.html");
var Vue = require("vue");
var vueScrollbar = require("vue-scrollbar");
// demo data
var data = {
    name: 'index',
    children: []
};
var ele = document.getElementById("view");

var lastH1 = null;
var lastH2 = null;

ele.childNodes.forEach(function (node) {
    if (node.localName == "h1") {
        lastH1 = {name: node.innerHTML, children: []};
        node.setAttribute("id", node.innerHTML);
        data.children.push(lastH1);
    }
    if (node.localName == "h2") {
        lastH2 = {name: node.innerHTML, children: []};
        node.setAttribute("id", node.innerHTML);
        lastH1 && lastH1.children.push(lastH2);
    }
    if (node.localName == "h3") {
        lastH2 && lastH2.children.push({name: node.innerHTML});
        node.setAttribute("id", node.innerHTML);
    }
});


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
                this.addChild()
                this.open = true
            }
        },
    }
});

// boot up the demo
var demo = new Vue({
    el: '#index',
    components:{
        'vue-scrollbar':vueScrollbar
    },
    data: {
        treeData: data
    }
});

