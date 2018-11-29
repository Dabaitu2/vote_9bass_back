/**
 *    Created by tomokokawase
 *    On 2018/11/28
 *    阿弥陀佛，没有bug!
 */


const Service   = require('egg').Service;
class UserService extends Service {
    async getStartProject(projects) {
        let ctx = this.ctx;
        const rst = await Promise.all(projects.map(async (v)=>{
            const {id, voteTitle, end} = await ctx.model.Vote.findOne({id: v});
            return {id, voteTitle, end}
        }));
        return rst;
    }
}

module.exports = UserService;
