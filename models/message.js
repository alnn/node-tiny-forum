'use strict';
const mongoose = require('../mongoose');

const MessageSchema = new mongoose.Schema({
  header: String,
  body: String
});

module.exports = mongoose.model('Message', MessageSchema);
