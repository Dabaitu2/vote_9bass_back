'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542628890125_2257';

    // open cors for all host
    config.cors = {
        origin: "*",
        allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS"
    };

    // temporarily prohibit csrf
    config.security = {
        csrf: {
            enable: false,
        }
    };

    config.multipart = {
        mode: 'file',
        // will append to whilelist
        fileExtensions: [
            '.foo',
            '.apk',
            '.doc'
        ],
    };

  // add your config here
  config.middleware = [];

  return config;
};
