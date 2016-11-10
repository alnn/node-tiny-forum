'use strict';

module.exports = {
  root: process.cwd(),
  mongoose: {
    uri: 'mongodb://localhost/node-tiny-forum',
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
