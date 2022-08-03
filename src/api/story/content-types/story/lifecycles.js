'use strict';

const uuid = require('uuid');

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    let userProfileId = 0
    console.log(data.shop);
    if (data.shop) {
      const userProfile = await strapi.db.query("api::shop.shop").findOne({
        select: [ 'owner_id' ],
        where: { id: data.shop },
      });
      console.log(userProfile);
      userProfileId = parseInt(userProfile['owner_id'] ?? 0);
    }
    event.params.data.owner_id = userProfileId;
    event.params.data.uid = `st${uuid.v4().replace('-','')}`;
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    if (typeof data.shop === "undefined") {
      console.log("is undefined");
    } else {
      let userProfileId = 0
      if (data.shop) {
        const userProfile = await strapi.db.query("api::shop.shop").findOne({
          select: ['owner_id'],
          where: { id: data.shop },
        });
        userProfileId = parseInt(userProfile['owner_id'] ?? 0);
      }
      event.params.data.owner_id = userProfileId;
    }
    
    delete event.params.data.uid;
  }
};
