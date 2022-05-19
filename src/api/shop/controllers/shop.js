'use strict';

/**
 *  shop controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shop.shop', ({ strapi }) =>  ({
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    ctx.request.body.data.user_profile = ctx.state.user.id;
    const response = await super.create(ctx);
    return response;
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const response = await super.update(ctx);
    return response;
  },
}));

