var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require("fs");
var http = require("http");
var url = require("url");
var net = require("net");
var config = require("./../config/config");

var app = express();
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var router = express.Router();
router.get('/.well-known/acme-challenge/:id', function (req, resp) {
    fs.createReadStream('/var/www/backkoms.com/.well-known/acme-challenge/' + req.params.id).pipe(resp);
});
app.use(router);

fs.readdirSync('apps/webserver/modules').forEach(function (file) {
    app.use('/', require('./modules/' + file))
});

module.exports = app;