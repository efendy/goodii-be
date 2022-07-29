'use strict';

/**
 *  shop controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shop.shop', ({ strapi }) =>  ({

  async findOne(ctx) {
    let response;
    if (ctx.params.id == "me" && ctx.state?.user?.id) {
      const userId = ctx.state?.user?.id;

      delete ctx.params.id;
      
      ctx.request.url += `&filters[owner_id][$eq]=${userId}`;

      response = await super.find(ctx);
    } else {
      response = await super.findOne(ctx);
    }
    return response;
  },

  async create(ctx) {
    ctx.request.body.data.user_profile = ctx.state.user.id;
    ctx.request.body.data.is_approved = false;
    ctx.request.body.data.is_rejected = false;
    ctx.request.body.data.rejected_reason = "";
    
    delete ctx.request.body.data['owner_id'];

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

          ctx.request.body.data.is_rejected = false;
          
          delete ctx.request.body.data.is_approved;
          delete ctx.request.body.data.rejected_reason;
          delete ctx.request.body.data.uid;
          delete ctx.request.body.data.owner_id;
          delete ctx.request.body.data.user_profile;

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

  async near(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    const {lon, lat, distance} = ctx.request.body.data;
    if (lon && lat) {
      
    } else {
      response.error.message = "Required lon and lat payload"
    }
    return response;
  },
}));
