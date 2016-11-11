'use strict';

const Router = require('koa-router');
const mongoose = require('mongoose');
const config = require('config');
const Message = require('../models/message');

/**
 * Validation generator for incoming message create/update params
 * @param next
 */
const genValidate = function* (next) {
  this.checkBody('header').notEmpty();
  this.checkBody('body').notEmpty();

  if (this.errors) {
    this.response.status = 400;
    this.body = this.errors;
    return;
  }

  yield next;
};

module.exports = new Router({
    prefix: '/message'
  })
  .param('id', function* (id, next) {

    /**
     * Check that message ID is valid
     */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.throw(400, `Invalid message ID ${id}`);
    }

    this.message = yield Message.findById(id);

    /**
     * Check that message exist
     */
    if (!this.message || this.message === 'Not Found') {
      this.throw(404, `Message does not exist`);
    }

    yield* next;
  })
  /**
   * POST /message with request body {header, body} to create new message
   */
  .post('/', genValidate, function* () {

    const { header, body } = this.request.body;

    const message = yield Message.create({
      body, header
    });

    const ID = message._id;

    this.body = { ID };
  })
  /**
   * POST /message/:id with request body {header, body} to update message
   */
  .post('/:id', genValidate, function* () {

    const { header, body } = this.request.body;

    this.message.header = header;
    this.message.body = body;

    yield this.message.save();

    const ID = this.message._id;

    this.body = { ID };
  })
  /**
   * GET /message - fetch all messages as id -> header
   */
  .get('/', function* () {

    const result = yield Message.find();
    let list = {};

    /**
     * Compose object id -> header
     */
    result.forEach(item => {
      list[item._id] = item.header;
    });

    this.body = { list };
  })
  /**
   * GET /message/:id to fetch message body
   */
  .get('/:id', function* () {

    this.body = this.message.body;
  })
  /**
   * DELETE /message/:id to delete message
   */
  .del('/:id', function* () {

    yield this.message.remove();

    this.body = 'ok';
  });
