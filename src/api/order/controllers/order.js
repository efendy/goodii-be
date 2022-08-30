'use strict';

/**
 *  order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dayjs = require('dayjs');

module.exports = createCoreController('api::order.order', ({ strapi }) => ({

  async findOne(ctx) {
    const { uid } = ctx.params;

    ctx.params.id = (await strapi.db.query("api::order.order").findOne({
      where: { uid },
    }))?.id || 0;
    
    return await super.findOne(ctx);
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
      const listingId = ctx.request.body.data['listing_id'];

      if (listingId) {
        const orderEntity = await strapi.db.query("api::order.order").findOne({
          where: {
            $and: [
              { listing_id: listingId },
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
      const { uid } = ctx.params;

      const entry = await strapi.db.query("api::order.order").findOne({
        where: { uid },
      });

      if (entry) {
        // Only allow to update order, who created it or listing owner.
        if (entry['owner_id'] == userId || entry['listing_owner_id'] == userId ) {
          ctx.params.id = entry['id'];

          delete ctx.request.body.data['uid'];
          delete ctx.request.body.data['listing'];
          delete ctx.request.body.data['user_profile'];
          delete ctx.request.body.data['listing_owner_id'];
          delete ctx.request.body.data['owner_id'];

          switch (ctx.request.body.data['status']) {
            case 'rejected':
            case 'completed':
              ctx.request.body.data['is_open'] = false;
              break;
            case 'paid':
              ctx.request.body.data['paid_at'] = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); //"2022-08-22T16:03:00.000Z"
            default:
              ctx.request.body.data['is_open'] = true;
          }
          
          response = await super.update(ctx);
        } else {
          response.error = { status: 401, name: "Unauthorized", message: `Not allow to update uid ${uid}` };
        }
      } else {
        response.error = { status: 404, name: "Not Found", message: `Invalid uid ${uid}` };
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

  async getMonthly(ctx) {
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
