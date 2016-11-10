'use strict';

module.exports = {
  root: process.cwd(),
  mongoose: {
    uri: 'mongodb://node-tiny-forum:sd8fhdf8ka334sd2j37x34@ds037617.mlab.com:37617/node-tiny-forum',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize: 5
      }
    }
  },
  port: 9000
};
