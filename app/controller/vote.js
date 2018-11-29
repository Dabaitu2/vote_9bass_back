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

class VoteController extends Controller {
    // 索引字段
    async index() {
        this.ctx.body = await this.ctx.model.Vote.find({});
    }

    // 查
    async show() {
        const ctx = this.ctx;
        ctx.body = await ctx.model.Vote.find({id: toInt(ctx.params.id)});
    }

    // 增
    async create() {
        const ctx = this.ctx;
        const { voteTitle, voteStarter, voteDesc, default_voters, options, restrict, min, max, start, end } = ctx.request.body;
        const id   = await ctx.model.Vote.find().count();
        const selectors = options.map((v, index) => {
           return {
               selector_id: index + 1,
               title: v,
               num: 0
           }
        });
        const user = await ctx.model.User.findOne({userId: voteStarter});
        if (!user) {
            ctx.status = 404;
            ctx.body = "no such user!";
        }
        try {
            const vote = await ctx.model.Vote.create({voteTitle, voteStarter, voteDesc, default_voters, selectors, id, restrict, min, max, start, end});
            const rst = await ctx.model.User.update({userId: voteStarter}, {
                $push: {
                    "project_start": id
                }
            });
            console.log(rst);
            ctx.status = 201;
            ctx.body = vote;
        } catch (e) {
            console.log(e);
            ctx.status = 404;
            ctx.body = "failed!";
        }

    }

    // 改
    async update() {
        const ctx = this.ctx;
        const id = toInt({id: toInt(ctx.params.id)});
        const vote = await ctx.model.Vote.findById(id);
        if (!vote) {
            ctx.status = 404;
            return;
        }

        const { voteTitle, voteDesc } = ctx.request.body;
        await vote.update({ voteTitle, voteDesc });
        ctx.body = vote;
    }

    // 投票
    async addVote() {
        console.log("===========投票请求===============");
        const ctx = this.ctx;
        const { action, id, userId } = ctx.request.body;
        const vote = await ctx.model.Vote.findOne({id: toInt(id)});
        const user = await ctx.model.User.findOne({userId});
        // 检查有没有这个项目和用户
        if (!vote || !user) {
            ctx.status = 404;
            console.log("没有当前用户");
            return;
        }
        const voters = vote.voters;
        // 检查是否已经投过票
        if (voters.indexOf(userId) >= 0) {
            ctx.status = 403;
            console.log("用户已经投过票");
            return;
        }
        if (parseInt(vote.end,10) < new Date().getTime()){
            ctx.status = 401;
            console.log("投票已经结束");
            return;
        }
        if (vote.restrict) {
            if (vote.default_voters.indexOf(userId) === -1) {
                ctx.status = 403;
                console.log("用户无权限");
                return;
            }
        }
        try {
            const date = new Date();
            const ans = await ctx.service.upload.uploadVote(date);
            if (ans !== "success") {
                ctx.status = 401;
                ctx.body = "failed!";
            }
            await ctx.service.history.createHistory(date);
            console.log("===========first step ok===============");
            const rst = await Promise.all(action.map(async (v, index) => {
                console.log(v);
                const rtr = await ctx.model.Vote.update({id: toInt(id), "selectors.selector_id": v.id}, {
                    $inc: {
                        "selectors.$.num": 1
                    }
                });
                return rtr;
            }));
            console.log(rst);
            console.log("===========second step ok===============");
            await ctx.model.Vote.update({id: toInt(id)}, {
                $push: {
                    "voters": userId
                }
            });
            console.log("===========third step ok===============");
            await ctx.model.User.update({userId}, {
                $push: {
                    project_join: id
                }
            });
            console.log("===========投票完成=================");
            ctx.body = "success";
        } catch (e) {
            console.log(e);
            ctx.status = 401;
        }
    }

    // 增加投票者
    async addVoter() {
        const ctx = this.ctx;
        const { userId, id } = ctx.request.body;
        const vote = await ctx.model.Vote.findOne({id: toInt(id)});
        console.log("vote: " + vote);
        if (!vote) {
            ctx.status = 404;
            return;
        }
        try {
            const rst = await ctx.model.Vote.update({id: toInt(id)}, {
                $push: {
                    "default_voters": userId
                }
            });
            console.log(rst);
            ctx.body = "success";
        } catch (e) {
            ctx.body = 401;
        }
    }


    // 删
    async destroy() {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const vote = await ctx.model.Vote.findById(id);
        if (!vote) {
            ctx.status = 404;
            return;
        }

        await vote.destroy();
        ctx.status = 200;
    }
}

module.exports = VoteController;


