/**
 *    Created by tomokokawase
 *    On 2018/11/28
 *    阿弥陀佛，没有bug!
 */


const Service   = require('egg').Service;


// 获取文件元数据
class HistoryService extends Service {
    async createHistory(Date) {
        const ctx = this.ctx;
        const { userId,  id, action } = ctx.request.body;
        const old_user =  await ctx.model.User.find({userId});
        if (!old_user) {
            ctx.status = 404;
            console.log("用户不存在!");
            ctx.body = "failed! no such userId!";
            return;
        }
        const _id = await ctx.model.History.find().count() + 1;
        const timeStamp = Date.getTime();
        const options = action.map(v=>{
            return v.title;
        });
        const history = await ctx.model.History.create({ userId, vote_id: id, options, id: _id, timeStamp });
        ctx.status = 201;
        ctx.body = history;
    }

    async getHistory() {
        const ctx = this.ctx;
        const { userId } = ctx.request.body;
        const old_user =  await ctx.model.User.find({userId});
        if (!old_user) {
            ctx.status = 404;
            console.log("用户不存在!");
            ctx.body = "failed! no such userId!";
            return;
        }
        const history = await ctx.model.History.find({ userId });
        try {
            const rst = await Promise.all(history.map(async v => {
                const filename = `vote_${v.timeStamp}_for_${v.vote_id}_voter_${v.userId}.json`;
                const meta = await this.ctx.service.getMeta.getMeta(filename);
                console.log(meta);
                return {
                    data: v,
                    meta: meta
                }
            }));
            ctx.status = 201;
            ctx.body = rst;
        } catch (e) {
            ctx.status = 500;
            ctx.body = "failed";
        }

    }
}

module.exports = HistoryService;
