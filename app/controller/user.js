/**
 *    Created by tomokokawase
 *    On 2018/11/27
 *    阿弥陀佛，没有bug!
 */


const Controller = require('egg').Controller;

function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
}

class UserController extends Controller {
    async index() {
        const ctx = this.ctx;
        const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
        ctx.body = await ctx.model.User.find(query);
    }


    async MyProjects() {
        const ctx = this.ctx;
        const { userId } = ctx.request.body;
        const user =  await ctx.model.User.findOne({userId});
        if (!user) {
            ctx.status = 404;
            return;
        }
        const project_start = user.project_start;
        if (!project_start.length) {
            ctx.status = 404;
            ctx.body = "no data";
            return;
        }
        const rtr = await this.ctx.service.user.getStartProject(project_start);
        ctx.status = 200;
        ctx.body = {
            status: "success",
            rtr
        };
    }

    async show() {
        const ctx = this.ctx;
        ctx.body = await ctx.model.User.find({id: toInt(ctx.params.id)});
    }

    async count() {
        const ctx = this.ctx;
        ctx.body = await ctx.model.User.find().count();
    }

    async create() {
        const ctx = this.ctx;
        const { userId, userName, password, isAdmin } = ctx.request.body;
        const old_user =  await ctx.model.User.find({userId});
        if (old_user.length) {
            ctx.status = 403;
            console.log("已经存在该用户!");
            ctx.body = "failed! duplicate userId!";
            return;
        }
        const id = await ctx.model.User.find().count() + 1;
        const user = await ctx.model.User.create({ userId, userName, password, isAdmin, id });
        ctx.status = 201;
        ctx.body = user;
    }

    async getHistory() {
        await this.ctx.service.history.getHistory();
    }

    async download() {
        const {timeStamp, vote_id, userId} = this.ctx.request.body;
        const filename = `vote_${timeStamp}_for_${vote_id}_voter_${userId}.json`;
        this.ctx.body = await this.ctx.service.download.downloadVote(filename);
    }


    async login() {
        const ctx = this.ctx;
        const { userId, password } = ctx.request.body;
        const user = await ctx.model.User.findOne({userId});
        if (!user || user.password !== password ) {
            ctx.status = 404;
            return;
        }
        ctx.status = 200;
        ctx.body = "success";
    }

    async update() {
        const ctx = this.ctx;
        const id = toInt({id: toInt(ctx.params.id)});
        const user = await ctx.model.User.findById(id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        const { userId, userName, password } = ctx.request.body;
        await user.update({ userId, userName, password });
        ctx.body = user;
    }

    async destroy() {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const user = await ctx.model.User.findById({id: toInt(ctx.params.id)});
        if (!user) {
            ctx.status = 404;
            return;
        }

        await user.destroy();
        ctx.status = 200;
    }
}

module.exports = UserController;


