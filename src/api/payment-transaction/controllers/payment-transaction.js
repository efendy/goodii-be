'use strict';

/**
 *  payment-transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dayjs = require('dayjs');

module.exports = createCoreController('api::payment-transaction.payment-transaction', ({ strapi }) => ({
  
  async findOneByUid(ctx) {
    const { uid } = ctx.params;

    ctx.params.id = (await strapi.db.query("api::payment-transaction.payment-transaction").findOne({
      where: { order_uid: uid },
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

    const orderUid = ctx.request.body.data['order_uid'];
    console.log(orderUid);
    if (orderUid) {
      const orderEntity = await strapi.db.query("api::order.order").findOne({
        where: { uid: orderUid },
      });
      const paymentTransactionEntity = await strapi.db.query("api::payment-transaction.payment-transaction").findOne({
        where: { order_uid: orderUid },
      });
      if (orderEntity) {
        const orderId = parseInt(orderEntity['id'] ?? 0);
        const shopId = parseInt(orderEntity['shop_id'] ?? 0);

        ctx.params.id = orderId;
        ctx.request.body.data['shop_id'] = shopId;
        ctx.request.body.data['order_uid'] = orderUid;
        ctx.request.body.data['locale'] = orderEntity['locale'];
        try {
          response = await this.update(ctx);
        } catch (e) {
          console.log(e);
          ctx.request.body.data.id = orderId;
          ctx.request.body.data['amount'] = orderEntity['net_amount'];
          ctx.request.body.data['cashout_amount'] = orderEntity['gross_amount'];
          response = await super.create(ctx);
        }
      } else {
        response.error.message = 'Order does not exist!'
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
    delete ctx.request.body.data['amount'];
    delete ctx.request.body.data['cashout_amount'];
    
    return await super.update(ctx);
  },

  async updateByUid(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    const entry = await strapi.db.query("api::payment-transaction.payment-transaction").findOne({
      where: { order_uid: orderUid },
    });
    if (entry) {
      const orderId = parseInt(entry['id'] ?? 0);
      ctx.params.id = orderId;
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
  
  async getUnclaimedAmount(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    if (ctx.state?.user) {
      // Only listing owner 
      const userId = ctx.state.user.id;
      const { shopId } = ctx.params;
      
      // const knex = strapi.db.connection;
      // const results = await knex('orders')
      //   .select(knex.raw('SUM(net_amount) as total, YEAR(paid_at) as year, MONTH(paid_at) as month'))
      //   .where(knex.raw(`shop_id = ${shopId} AND listing_owner_id = ${userId} AND status = 'completed' AND is_open = FALSE`))
      //   .groupByRaw('YEAR(paid_at), MONTH(paid_at)');

	    // return this.transformResponse({results});
    }
    return response;
  },
}));
