'use strict';

const config = require('config');
const request = require('co-request');
const Message = require('../models/message');
const should = require('should');
const dbHelper = require('./dbHelper');

/**
 * Run application
 */
require('..').listen(config.port);

/**
 * Compose urls
 * @param path
 */
const getURL = (path = '') => `http://localhost:${config.port}/message${path}`;

describe('Message API', () => {

  before(dbHelper.genCleanUp);

  describe('POST /message', () => {

    let messageToUpdate;

    before(function* () {
      yield* dbHelper.genFillUp();
      messageToUpdate = dbHelper.getLastMessage();
    });

    after(dbHelper.genCleanUp);

    it('Create new message - success', function* () {

      const response = yield request({
        method: 'post',
        url: getURL('/'),
        json: true,
        body: {
          header: 'create test header',
          body: 'create test body'
        },
      });

      response.statusCode.should.eql(200);
      response.headers['content-type'].should.match(/application\/json/);

      should.exist(response.body.ID);
    });

    it('Create new message - fail (body can not be empty.)', function* () {

      const response = yield request({
        method: 'post',
        url: getURL('/'),
        json: true,
        body: {
          header: 'Test header'
        },
      });

      response.statusCode.should.eql(400);
      response.body.should.eql([ { body: 'body can not be empty.' } ]);
    });

    it('Create new message - fail (header can not be empty.)', function* () {

      const response = yield request({
        method: 'post',
        url: getURL('/'),
        json: true,
        body: {
          body: 'Test message body'
        },
      });

      response.statusCode.should.eql(400);
      response.body.should.eql([ { header: 'header can not be empty.' } ]);
    });

    it('Update message - success', function* () {

      const response = yield request({
        method: 'post',
        url: getURL(`/${messageToUpdate._id}`),
        json: true,
        body: {
          header: 'test header modified',
          body: 'test body modified'
        }
      });

      response.statusCode.should.eql(200);
      response.headers['content-type'].should.match(/application\/json/);

      should.exist(response.body.ID);
    });

    it('Update message - fail (header can not be empty. & body can not be empty.)', function* () {

      const response = yield request({
        method: 'post',
        url: getURL(`/${messageToUpdate._id}`),
        json: true
      });

      response.statusCode.should.eql(400);
      response.headers['content-type'].should.match(/application\/json/);
      response.body.should.eql([ { header: 'header can not be empty.' }, { body: 'body can not be empty.' } ]);
    });

  });

  describe('GET /message', () => {

    let messageToGet;

    before(function* () {
      yield* dbHelper.genFillUp();
      messageToGet = dbHelper.getLastMessage();
    });

    after(dbHelper.genCleanUp);

    it('Get list of messages (as list of pairs < ID, header>)', function* () {

      const response = yield request({
        method: 'get',
        uri: getURL('/'),
        json: true
      });

      response.statusCode.should.eql(200);
      response.headers['content-type'].should.match(/application\/json/);

      should.exist(response.body.list);
      Object.keys(response.body.list).should.have.length(3);
    });

    it('Get message body (by ID) - success', function* () {

      const response = yield request.get(getURL(`/${messageToGet._id}`));

      response.statusCode.should.eql(200);

      response.body.should.eql(messageToGet.body);
    });

    it('Get message body (by ID) - fail (Invalid message ID)', function* () {

      const response = yield request.get(getURL(`/123`));

      response.statusCode.should.eql(400);
      response.body.should.match(/Invalid message ID/);
    });

    it('Get message body (by ID) - fail (Message does not exist)', function* () {

      const response = yield request.get(getURL(`/000000000000000000000001`));

      response.statusCode.should.eql(404);
      response.body.should.match(/Message does not exist/);
    });

  });

  describe('DELETE /message', () => {

    let messageToDelete;

    before(function* () {
      yield* dbHelper.genFillUp();
      messageToDelete = dbHelper.getLastMessage();
    });

    after(dbHelper.genCleanUp);

    it('Delete message (by ID) - success', function* () {

      const response = yield request.del(getURL(`/${messageToDelete._id}`));

      response.statusCode.should.eql(200);

      response.body.should.eql('ok');

      let message = yield Message.findById(messageToDelete._id);

      should.not.exist(message);
    });

  });

});
