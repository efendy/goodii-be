'use strict';

const uuid = require('uuid');

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    event.params.data.owner_id = parseInt(data.user_profile ?? 0);
    event.params.data.uid = `sh${uuid.v4().replace('-','')}`;
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    if (data.user_profile) {
      event.params.data.owner_id = parseInt(data.user_profile);
    }
    delete event.params.data.uid;
  }
};
