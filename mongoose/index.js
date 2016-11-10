'use strict';

const mongoose = require('mongoose');

/**
 * mpromise is deprecated, so use native promises
 */
mongoose.Promise = Promise;

module.exports = mongoose;