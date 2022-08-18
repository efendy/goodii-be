'use strict';

const uniqid = require('uniqid');

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    event.params.data.owner_id = parseInt(data.user_profile ?? 0);
    event.params.data.uid = uniqid('sh');
  },
  async beforeUpdate(event) {
    const { data, populate } = event.params;
    if (populate?.user_profile) {
      event.params.data.owner_id = parseInt(data.user_profile ?? 0);
    }
    delete event.params.data.uid;
  }
};
