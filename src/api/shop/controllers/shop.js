'use strict';

/**
 *  shop controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shop.shop', ({ strapi }) =>  ({

  async create(ctx) {
    ctx.request.body.data['user_profile'] = ctx.state.user.id;
    const response = await super.create(ctx);
    return response;
  },

  async createMany(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    return response;
  },

  async update(ctx) {
    console.log(ctx.params.id);

    const entry = await super.findOne(ctx);
    if (entry) {

    }
    // const entry = await strapi.entityService.findOne('api::article.article', 1, {
    //   fields: ['title', 'description'],
    //   populate: { category: true },
    // });

    const response = await super.update(ctx);
    return response;
  },

  async updateMany(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    return response;
  },
}));
