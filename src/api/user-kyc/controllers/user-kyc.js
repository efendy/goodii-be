'use strict';

/**
 *  user-kyc controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-kyc.user-kyc', ({ strapi }) =>  ({

  async findOne(ctx) {
    if (ctx.params.id == "me") {
      if (ctx.state?.user) {
        ctx.params.id = ctx.state?.user?.id;
      }
    }
    const response = await super.findOne(ctx);
    return response;
  },

  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    ctx.request.body.data.user_profile = ctx.state.user.id;
    ctx.request.body.data.id = ctx.state.user.id;
    const response = await super.create(ctx);
    return response;
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    ctx.params.id = ctx.state.user.id;
    const response = await super.update(ctx);
    return response;
  },
}));
