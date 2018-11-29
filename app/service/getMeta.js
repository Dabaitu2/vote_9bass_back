/**
 *    Created by tomokokawase
 *    On 2018/11/28
 *    阿弥陀佛，没有bug!
 */

const {test, sha1_b64_hmac} = require("../constants/configs");

const Service   = require('egg').Service;
const fs        = require('fs');
const path      = require('path');
const request   = require("request-promise-native");

// 获取文件元数据
class GetMetaService extends Service {
    async getMeta(filename) {
        let ctx = this.ctx;

        const date = new Date();

        try {
            const canonicalString = 'HEAD'
                +'\n'
                + "\n" // md5
                + "\n" // contentType
                + date.toUTCString() + '\n' // 日期
                + "/" + filename;

            const hmac = sha1_b64_hmac(test.SecretKey, canonicalString);
            const Authorization = "9BAAS " + test.AccessKeyId + ":" + hmac;

            console.log(`[Authorization]: ${Authorization}`);


            const options = {
                method: 'HEAD',
                // PUT 请求需要指定位置
                url: 'http://49.4.82.98:32720/api/' + filename,
                headers: {
                    'Authorization': Authorization,
                    'Date' : date.toUTCString(),
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'zh-CN,zh;q=0.9'
                }
            };

            return request(options)
                .then(body =>{
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

module.exports = GetMetaService;
