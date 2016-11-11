'use strict';

const koa = require('koa');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = require('config');
const messageRouter = require('./routes/message');

/**
 * Connect to database
 */
mongoose.connect(config.mongoose.uri, config.mongoose.options);

/**
 * Get middlewares
 */
const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

const app = koa();

require('koa-validate')(app);

/**
 * load & use middlewares
 */
middlewares.forEach(middleware => app.use(require(`./middlewares/${middleware}`)));

app.use(messageRouter.routes());

if (module.parent) {
  /**
   * Export koa app if this file required
   */
  module.exports = app;
} else {
  app.listen(config.port);
  console.log(`Server started, listening on port ${config.port}`);
}
console.log(`Environment: ${process.env.NODE_ENV}`);
