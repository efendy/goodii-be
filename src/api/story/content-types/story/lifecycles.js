'use strict';

const uuid = require('uuid');

module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    let userProfileId = 0
    if (data.shop) {
      const userProfile = await strapi.db.query("api::shop.shop").findOne({
        select: [ 'owner_id' ],
        where: { id: data.shop },
      });
      console.log(userProfile);
    }
    event.params.data.owner_id = parseInt(userProfileId);
    event.params.data.uid = `st-${uuid.v4()}`;
  },
  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    let userProfileId = 0
    if (data.shop) {
      const userProfile = await strapi.db.query("api::shop.shop").findOne({
        select: ['owner_id'],
        where: { id: data.shop },
      });
      console.log(userProfile);
      userProfileId = userProfile['owner_id'] ?? 0;
    }
    event.params.data.owner_id = parseInt(userProfileId);
    delete event.params.data.uid;
  }
};
