'use strict';

const uuid = require('uuid');

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    event.params.data.uid = uuid.v4();
  }
};
