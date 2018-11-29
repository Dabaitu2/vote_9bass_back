/**
 *    Created by tomokokawase
 *    On 2018/11/29
 *    阿弥陀佛，没有bug!
 */

const {test, sha1_b64_hmac} = require("../constants/configs");

const Service   = require('egg').Service;
const fs        = require('fs');
const path      = require('path');
const request   = require("request-promise-native");

// 下载文件
class DownloadService extends Service {
    async downloadVote(filename) {
        console.log("========开始尝试下载===========");
        let ctx = this.ctx;

        const date = new Date();
        const {contentLength} = ctx.request.body;

        try {
            const canonicalString = 'GET'
                +'\n'
                + "\n" // md5
                + "application/xml" + "\n" // contentType
                + date.toUTCString() + '\n' // 日期
                + "/" + filename;

            const hmac = sha1_b64_hmac(test.SecretKey, canonicalString);
            const Authorization = "9BAAS " + test.AccessKeyId + ":" + hmac;

            console.log(`[Authorization]: ${Authorization}`);


            const options = {
                method: 'GET',
                // PUT 请求需要指定位置
                url: 'http://49.4.82.98:32720/api/' + filename,
                headers: {
                    'Authorization': Authorization,
                    'Date' : date.toUTCString(),
                    'Content-Length': contentLength,
                    'Content-type'  : "application/xml",
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'zh-CN,zh;q=0.9'
                }
            };

            return request(options)
                .then(body =>{
                    console.log(body);
                    return body
                })
                .catch(err => {
                    throw err;
                });

        } catch (err) {
            console.log(err);
            throw err;
        }

    }
}

module.exports = DownloadService;