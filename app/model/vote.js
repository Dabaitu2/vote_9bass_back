/**
 *    Created by tomokokawase
 *    On 2018/11/27
 *    阿弥陀佛，没有bug!
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema   = mongoose.Schema;

    const VoteSchema = new Schema({
        id    :       { type: Number, primaryKey: true, required: true },
        voteTitle:    { type: String, required: true },
        voteStarter:  { type: Number, required: true },
        voteDesc:     { type: String },
        voters:       { type: Array, default: [] },
        start:        { type: String, default: new Date().getTime()},
        end:          { type: String, default: new Date().getTime() + 24 * 60 * 60 * 1000, required: true},
        max:          { type: Number},
        min:          { type: Number, default: 1},
        restrict:     { type: Boolean, default: false},
        default_voters: { type: Array, default: [] },
        selectors:    [
            {
                selector_id: Number,
                title: String,
                num: Number
            }
        ]
    });

    return mongoose.model('Vote', VoteSchema);
};