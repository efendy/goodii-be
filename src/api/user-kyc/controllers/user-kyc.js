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

  async create(ctx) {
    let response = {
      data: null,
      error: {
        status: 401,
        name: "UnauthorizedError",
        message: "Required valid authentication"
      }
    };
    if (ctx.state?.user) {
      ctx.request.body.data.user_profile = ctx.state.user.id;
      ctx.request.body.data.id = ctx.state.user.id;
      response = await super.create(ctx);
    }
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
    let response = {
      data: null,
      error: {
        status: 401,
        name: "UnauthorizedError",
        message: "Required valid authentication"
      }
    };
    if (ctx.state?.user) {
      ctx.params.id = ctx.state.user.id;
      response = await super.update(ctx);
    }
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
