'use strict';

/**
*  listing controller
*/

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::listing.listing', ({ strapi }) => ({
  async findOne(ctx) {
    const response = await super.findOne(ctx);
    if (!ctx.request.body['no_count']) {
      if (response?.data?.id) {
        console.log(response);
        const dataId = response.data.id;
        const viewCount = parseInt(response.data.attributes['view_count'] ?? 0) + 1;
        await strapi.entityService.update('api::listing.listing', dataId, {
          data: {
            view_count: viewCount,
          },
        });
        response.data.attributes['view_count'] = viewCount;
      }
    }
    
    return response;
  },
  
  async create(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    if (ctx.state?.user) {
      const userId = ctx.state.user.id;
      const shopId = ctx.request.body.data['shop'];
      if (shopId) {
        const userProfile = await strapi.db.query("api::shop.shop").findOne({
          select: [ 'owner_id' ],
          where: { id: shopId },
        });
        if (userProfile) {
          const userProfileId = parseInt(userProfile['owner_id'] ?? 0);
          if (userProfileId > 0 && userProfileId == userId) {
            response = await super.create(ctx);
          } else {
            response.error = { status: 401, name: "Unauthorized", message: `Not allow to create for shop ${shopId}` };
          }
        }
      } else {
        response.error.message = "Missing shop id.";
      }
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
      ctx.request.body['no_count'] = true;
      const entry = await super.findOne(ctx);
      if (entry) {
        if (entry.data.attributes['owner_id'] == userId) {
          
          // Fields which should not be modified by user
          delete ctx.request.body.data['uid'];
          delete ctx.request.body.data['owner_id'];
          
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
