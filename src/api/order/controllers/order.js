'use strict';

/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({

  async findOne(ctx) {
    const { uid } = ctx.params;

    const entity = await strapi.db.query('api::order.order').findOne({
      where: { uid },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity);
    return this.transformResponse(sanitizedEntity);
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
      const listingId = ctx.request.body.data['listing'];

      if (listingId) {
        const orderEntity = await strapi.db.query("api::order.order").findOne({
          where: {
            $and: [
              { listing: { id: listingId } },
              { owner_id: userId },
              { is_open: true },
            ]
          },
        });

        if (orderEntity) {
          const sanitizedOrderEntity = await this.sanitizeOutput(orderEntity);
          
          response = this.transformResponse(sanitizedOrderEntity);
        } else {
          const listingEntity = await strapi.db.query("api::listing.listing").findOne({
            select: [ 'owner_id' ],
            where: { id: listingId },
          });
          if (listingEntity) {
            const listingOwnerId = parseInt(listingEntity['owner_id'] ?? 0);
            if (listingOwnerId > 0 && listingOwnerId == userId) {
              response.error = { status: 401, name: "Unauthorized", message: "Not allow to create order for self" };
            } else {
              ctx.request.body.data['listing_owner_id'] = listingOwnerId;
              ctx.request.body.data['user_profile'] = userId;
              ctx.request.body.data['owner_id'] = userId;
              ctx.request.body.data['is_open'] = true;
              ctx.request.body.data['status'] = "open";
              ctx.request.body.data['status_payment'] = "none";
              ctx.request.body.data['status_fulfillment'] = "open";
              response = await super.create(ctx);
            }
          } else {
            response.error = { status: 404, name: "Not Found", message: "Listing does not exist." };
          }
        }
      } else {
        response.error.message = "Missing listing id.";
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
      const userId = ctx.state.user.id;

      // only listing owner and order owner can edit this.
      const entry = await super.findOne(ctx);
      if (entry) {
        if (entry.data.attributes['owner_id'] == userId || entry.data.attributes['listing_owner_id'] == userId ) {

          delete ctx.request.body.data['uid'];
          delete ctx.request.body.data['listing'];
          delete ctx.request.body.data['user_profile'];
          delete ctx.request.body.data['listing_owner_id'];
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
