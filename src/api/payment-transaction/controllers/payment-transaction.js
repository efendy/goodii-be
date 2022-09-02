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
        populate: {
          shop: true,
        }
      });
      const paymentTransactionEntity = await strapi.db.query("api::payment-transaction.payment-transaction").findOne({
        where: { order_uid: orderUid },
      });
      if (orderEntity) {
        const orderId = parseInt(orderEntity['id'] ?? 0);
        const shopId = parseInt(orderEntity['shop']['id'] ?? 0);

        ctx.params.id = orderId;

        const payloadData = {
          id: orderId,
          shop_id: shopId,
          order_uid: orderUid,
          shop: shopId,
          order: orderId,
          amount: orderEntity['net_amount'],
          cashout_amount: orderEntity['gross_amount'],
          locale: orderEntity['locale'],
        }
        try {
          ctx.request.body.data = {...payloadData};
          response = await this.update(ctx);
        } catch (e) {
          ctx.request.body.data = {...payloadData};
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
    delete ctx.request.body.data['shop'];
    delete ctx.request.body.data['order'];
    delete ctx.request.body.data['shop_id'];
    delete ctx.request.body.data['order_uid'];
    
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
    const { uid } = ctx.params;

    const entry = await strapi.db.query("api::payment-transaction.payment-transaction").findOne({
      where: { order_uid: uid },
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
      const { pipeline } = ctx.query;

      let isAllow = true;
      if (pipeline !== 'admin') {
        // Make sure shop belongs to user
        const entry = await strapi.db.query("api::shop.shop").findOne({
          select: [ 'owner_id' ],
          where: { id: shopId },
          populate: {
            user_profile: true,
          }
        });
        console.log('userId', userId, 'shopOwnerId', entry.owner_id, entry.user_profile?.id);
        isAllow = userId === (entry.user_profile?.id || 0);
      }
      
      if (isAllow) {
        const knex = strapi.db.connection;
        const results = await knex('payment_transactions')
          .select(knex.raw('SUM(cashout_amount) as total'))
          .where(knex.raw(`cashout_status <> 'done' AND status = 'complete' AND shop_id = ${shopId}`));
        return this.transformResponse({ total: results[0]?.total || 0 });
      } else {
        response.error = {
          status: 403,
          name: "Forbidden",
          message: "Shop not belong to user."
        }
      }
    }
    return response;
  },
}));
