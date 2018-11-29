/**
 *    Created by tomokokawase
 *    On 2018/11/27
 *    阿弥陀佛，没有bug!
 */

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema   = mongoose.Schema;

    const UserSchema = new Schema({
        id:   { type: Number, primaryKey: true, required: true},
        userId: {type: Number, required: true, unique: true},
        userName: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin:  { type: Boolean, default: false},
        project_start: {type: [], default: []},
        project_join: {type: [], default: []}
    });

    return mongoose.model('User', UserSchema);
};

