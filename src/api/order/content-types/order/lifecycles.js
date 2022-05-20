'use strict';

const uuid = require('uuid');

module.exports = {
  beforeCreate(event) {
    console.log(event);
    const { data, where, select, populate } = event.params;
    // event.params.data.owner_id = data.shop?.owner_id ?? "";
    event.params.data.uid = `or-${uuid.v4()}`;
  }
};
