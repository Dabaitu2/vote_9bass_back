/**
 *    Created by tomokokawase
 *    On 2018/11/19
 *    阿弥陀佛，没有bug!
 */
'use strict';

const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');
const path = require('path');
const toArray = require('stream-to-array');
const fs = require('fs');
// const request = require('request-promise-native');


class requestController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';
    }
    async handlePut() {
        let ctx = this.ctx;
        // const stream = await ctx.getFileStream();
        // const filename = stream.filename;
        console.log(ctx.request);
        // console.log(filename);
        this.ctx.body = 'over====';
    }
    async transfer() {
        let ctx = this.ctx;
        const uploadBasePath = 'app/public/upload/';
        const stream = await ctx.getFileStream();
        const filename = stream.filename;
        console.log(filename);
        const target = path.join(this.config.baseDir, uploadBasePath, filename);
        const desc = JSON.parse(stream.fields.desc);
        // const file = ctx.request.files[0];
        // console.log(ctx.request);
        // //
        try {




        //     // 转化stream
            const parts = await toArray(stream);
        //     // 写入文件
            let buf = Buffer.concat(parts);
        //     // 写入文件保存至本地
            fs.writeFileSync(target, buf);
            const options = {
                method: 'PUT',
                // PUT 请求需要指定位置
                url: 'http://49.4.82.98:32720/api/' + filename,
                headers: {
                    'content-type': 'application/octet-stream',
                    'Authorization': desc.Authorization,
                    'x-9baas-date' : desc.Date,
                    'Content-MD5'  : desc.contentMd5,
                    'Content-Length': desc.contentLength,
                    'accept': '*/*',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'zh-CN,zh;q=0.9'
                }
            };

            fs.createReadStream(target)
                .pipe(request(options))
                .then(body =>{
                    console.log(body);
                })
                .catch(err => {
                    console.log(err);
                });
            this.ctx.body = 'finished';
            console.log("================success==================");
        } catch (err) {
            console.log(err);
            await sendToWormhole(stream);
            throw err;
        }


    }
}

// module.exports = requestController;
