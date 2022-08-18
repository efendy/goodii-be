'use strict';

const uniqid = require('uniqid');

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    event.params.data.uid = uniqid('md');
  }
};
