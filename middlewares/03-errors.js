'use strict';

module.exports = function* (next) {

  try {

    yield* next;

  } catch (e) {
    if (e.status) {

      this.body = e.message;
      this.status = e.status;

    } else {

      this.body = 'Error 500';
      this.status = 500;

      console.error(e.message, e.stack);
    }
  }

};
