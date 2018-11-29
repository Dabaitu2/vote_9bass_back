/**
 *    Created by tomokokawase
 *    On 2018/11/29
 *    阿弥陀佛，没有bug!
 *
 *    历史纪录
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema   = mongoose.Schema;

    const HistorySchema = new Schema({
        id:   { type: Number, primaryKey: true, required: true},
        userId: {type: Number, required: true},
        vote_id: { type: Number, required: true },
        options: {type: Array, default:[], required:true},
        timeStamp: {type: String, required: true}
    });

    return mongoose.model('History', HistorySchema);
};

