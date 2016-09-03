var express = require('express');
var router = express.Router();
var pushService = require('../service/pushService');
var Stream = require('stream');
/* GET home page. */
router.get('/', function (req, resp, next) {
    pushService.push('/javascript/header.js', resp);
    resp.render('header', {title: '施工中', isLogin: req.isLogin});
});


var qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'mSi5cLcOjYaBURRrWi_vEu6QbELhf1788CUHNGKl';
qiniu.conf.SECRET_KEY = 'sZw7wz-P6SNtf4FVlUQk93FbcP9xybeRHe1vvcjN';

//要上传的空间
bucket = 'test';

//上传到七牛后保存的文件名
key = 'my-nodejs-logo.png';


function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}
var multer = require('multer');
var upload = multer();
var stream = require('stream');
router.post('/upload', upload.single('img'), function (req, resp) {
    console.log(req.file);

    try {
        var name = new Date().getTime() + "";
        qiniu.io.put(uptoken(bucket, name), name, req.file.buffer, new qiniu.io.PutExtra(), function (err, ret) {
            if (!err) {
                resp.json({status: 200, data: "http://oboyzou3r.bkt.clouddn.com/" + name});
            } else {
                resp.json({status: 500});
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
