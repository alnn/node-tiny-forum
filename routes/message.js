'use strict';

const Router = require('koa-router');
const mongoose = require('mongoose');
const config = require('config');
const Message = require('../models/message');

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
  .post('/create', function* () {

    const { header, body } = this.request.body;

    if (!body) {
      this.throw(400, 'Message body required!');
    }
    if (!header) {
      this.throw(400, 'Message header required!');
    }

    const message = yield Message.create({
      body, header
    });

    const ID = message._id;

    this.body = { ID };
  })
  .post('/update/:id', function* () {

    const { header, body } = this.request.body;

    this.message.header = header;
    this.message.body = body;

    yield this.message.save();

    const ID = this.message._id;

    this.body = { ID };
  })
  .get('/list', function* () {

    const result = yield Message.find();
    let list = {};

    /**
     * Compose object id -> header
     */
    result.forEach(item => {
      item = item.toObject();
      list[item._id] = item.header;
    });

    this.body = { list };
  })
  .del('/:id', function* () {

    yield this.message.remove();

    this.body = 'ok';
  })
  .get('/:id', function* () {

    this.body = this.message.body;
  })
  .routes();
