/**
 *    Created by tomokokawase
 *    On 2018/11/28
 *    阿弥陀佛，没有bug!
 */


const Hashes = require('jshashes');


module.exports = {
    test: {
        // AccessKeyId : "TEST-BTAS6SAkURD9gtWI-t8_",
        AccessKeyId : "TEST-Ut0SHfmUVWr950aHz5Iw",
        // SecretKey   : "TEST-7tXpgSvNw_4PdHdDibjBL4WvbtX3r9TqwHDPbcuD",
        SecretKey   : "TEST-d_pveNMUqU_5aQmBkq3IuxEUBPHR9FhzWaQSHzAn",
    },
    product: {
        AccessKeyId : "doCMfaHwSJCApQpHXrF7",
        SecretKey   : "AsYOtpmTEtevLnAXJXTkPRQOpA6Q_b-AB8OtQ5qT",
    },
    contentType : "application/octet-stream",
    // host        : "api.9broad.com",
    host        : "49.4.82.98:32720",
    // hostUrl     : "http://api.9broad.com",
    hostUrl     : "http://49.4.82.98:32720/api",
    sha1_b64_hmac  : new Hashes.SHA1().b64_hmac
};