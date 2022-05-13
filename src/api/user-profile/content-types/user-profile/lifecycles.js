'use strict';

const uuid = require('uuid');

module.exports = {
  beforeCreate(event) {
    console.log("beforeCreate");
    const { data, where, select, populate } = event.params;
    event.params.data.uid = uuid.v4();
  },
  afterFindMany(event) {
    console.log("afterFindMany");
  },
  afterFindOne(event) {
    console.log("afterFindOne");
  }
};