/**
 *    Created by tomokokawase
 *    On 2018/11/19
 *    阿弥陀佛，没有bug!
 */
/**
 *    Created by tomokokawase
 *    On 2018/11/19
 *    阿弥陀佛，没有bug!
 */
'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');


class getPutController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';
    }
    async answer() {
        let ctx = this.ctx;
        // const stream = await ctx.getFileStream();
        // console.log(stream.filename);
        console.log(ctx.request);
        this.ctx.body = "answer got it";
    }
}

module.exports = getPutController;
