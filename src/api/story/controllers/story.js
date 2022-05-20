'use strict';

/**
 *  story controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::story.story', ({ strapi }) =>  ({
  
  async create(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    const shopId = ctx.request.body.data['shop'];
    if (shopId) {
      const response = await super.create(ctx);
    } else {
      response.error.message = "Missing shop id.";
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
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    if (ctx.state?.user) {
      const userId =  ctx.state.user.id;
      const entry = await super.findOne(ctx);
      if (entry) {
        if (entry.data.attributes['owner_id'] == userId) {

          // Fields which should not be modified by user
          delete ctx.request.body.data['uid'];
          delete ctx.request.body.data['owner_id'];

          console.log(ctx.request.body);
          response = await super.update(ctx);
        } else {
          response.error = { status: 401, name: "Unauthorized", message: `Not allow to update id ${ctx.params.id}` };
        }
      } else {
        response.error = { status: 404, name: "Not Found", message: `Invalid id ${ctx.params.id}` };
      }
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
