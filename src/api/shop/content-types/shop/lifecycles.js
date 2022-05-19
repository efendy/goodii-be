'use strict';

const uuid = require('uuid');

module.exports = {
  beforeCreate(event) {
    console.log(event);
    const { data, where, select, populate } = event.params;
    event.params.data.owner_id = data.user_profile ?? "";
    event.params.data.uid = `sh-${uuid.v4()}`;
  }
};
