/**
 *    Created by tomokokawase
 *    On 2018/11/28
 *    阿弥陀佛，没有bug!
 */

const {contentType, test, sha1_b64_hmac} = require("../constants/configs");

const crypto = require('crypto');
const Controller = require('egg').Controller;
const fs   = require('fs');
const path = require('path');
const request = require("request-promise-native");

// 上传文件到联盟链
class UploadController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';
    }

    async uploadVote() {
        let ctx = this.ctx;
        const uploadBasePath = 'app/public/upload/';
        const {
            userId,     // 投票者id
            id,         // 投票项目id
            voteTitle,  // 投票项目名称
            action      // 投票对象id + 名称
        } = ctx.request.body;

        const date = new Date();
        const filename = `vote_${date.getTime()}.json`;
        const target   =  path.join(this.config.baseDir, uploadBasePath, filename);

        const info = JSON.stringify({
            userId,
            vote_id: id,
            voteTitle,
            selector_title: action.title,
            selector_id: action.id
        });
        try {
            fs.writeFileSync(target, info, 'utf8');
            const fileBuffer = fs.readFileSync(target);
            const contentLength = fileBuffer.length;
            const md5 = crypto.createHash('md5');

            const contentMd5 = new Buffer(
                                    md5.update(fileBuffer).
                                    digest('hex').
                                    substring(8, 24)).
                                    toString('base64');

            const canonicalString = 'PUT'
                +'\n'
                + contentMd5 + "\n"
                + contentType + "\n"
                + "\n" // 元数据
                + "x-9baas-date:" +date.toUTCString() + "\n"
                + "/" + filename;

            const hmac = sha1_b64_hmac(test.SecretKey, canonicalString);
            const Authorization = "9BAAS " + test.AccessKeyId + ":" + hmac;

            console.log(`[Authorization]: ${Authorization}`);


            const options = {
                method: 'PUT',
                // PUT 请求需要指定位置
                url: 'http://49.4.82.98:32720/api/' + filename,
                headers: {
                    'content-type': 'application/octet-stream',
                    'Authorization': Authorization,
                    'x-9baas-date' : date.toUTCString(),
                    'Content-MD5'  : contentMd5,
                    'Content-Length': contentLength,
                    'accept': '*/*',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'zh-CN,zh;q=0.9'
                }
            };

            fs.createReadStream(target)
                .pipe(request(options))
                .then(body =>{
                    console.log(body);
                    this.ctx.body = 'finished';
                })
                .catch(err => {
                    console.log(err);
                });

        } catch (err) {
            console.log(err);
            throw err;
        }

    }
}

module.exports = UploadController;
