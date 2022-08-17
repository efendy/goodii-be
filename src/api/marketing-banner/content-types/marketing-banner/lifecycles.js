'use strict';

const uuid = require('uuid');

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    event.params.data.uid = `mb${uuid.v4().replace('-','')}`;
  }
};