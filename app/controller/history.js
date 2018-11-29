/**
 *    Created by tomokokawase
 *    On 2018/11/27
 *    阿弥陀佛，没有bug!
 *
 *    历史纪录资源
 */


const Controller = require('egg').Controller;

function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
}

class HistoryController extends Controller {
    async index() {
        const ctx = this.ctx;
        const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
        ctx.body = await ctx.model.History.find(query);
    }


    async show() {
        const ctx = this.ctx;
        ctx.body = await ctx.model.History.find({id: toInt(ctx.params.id)});
    }

    async count() {
        const ctx = this.ctx;
        ctx.body = await ctx.model.History.find().count();
    }

    async create() {
        const ctx = this.ctx;
        const { userId,  vote_id, options } = ctx.request.body;
        const old_user =  await ctx.model.User.find({userId});
        if (!old_user) {
            ctx.status = 404;
            console.log("用户不存在!");
            ctx.body = "failed! no such userId!";
            return;
        }
        const id = await ctx.model.History.find().count() + 1;
        const history = await ctx.model.History.create({ userId, vote_id, options, id });
        ctx.status = 201;
        ctx.body = history;
    }

    async destroy() {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const history = await ctx.model.History.findById({id: toInt(id)});
        if (!history) {
            ctx.status = 404;
            return;
        }

        await history.destroy();
        ctx.status = 200;
    }
}

module.exports = HistoryController;


