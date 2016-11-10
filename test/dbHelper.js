'use strict';

const mongoose = require('mongoose');
const Message = require('../models/message');

module.exports = {
  messages: [],
  getLastMessage() {
    return this.messages[this.messages.length - 1];
  },
  /**
   * Generate messages
   */
  *genFillUp() {
    let arr = Array.apply(null, Array(3))
      .map((item, index) => Object.assign({}, {
        header: `Message header ${index + 1}`,
        body: `Message body ${index + 1}`
      }));

    for (let i = 0; i < arr.length; i++) {
      let message = yield Message.create(arr[i]);
      this.messages.push(message);
    }

  },
  /**
   * Cleanup collections
   */
  *genCleanUp() {
    yield Message.remove();
  }
};
