'use strict';

/**
 *  story controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::story.story', ({ strapi }) =>  ({
  
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
    // ctx.params.id = ctx.state.user.id;
    try {
      const { data, meta} = await super.findOne(ctx);
    } catch (e) {
      console.log(`ERROR ${e}`);
    }

    const response = await super.update(ctx);
    return response;
  },
}));
