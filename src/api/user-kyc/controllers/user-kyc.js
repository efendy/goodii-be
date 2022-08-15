'use strict';

/**
 *  user-kyc controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-kyc.user-kyc', ({ strapi }) =>  ({

  async findOne(ctx) {
    if (ctx.params.id == "me") {
      console.log(ctx.query);
      if (ctx.state?.user && ctx.query.locale) {
        delete ctx.params.id;
  
        const userId = ctx.state.user.id;
  
        // Find existing user KYC, where one locale of a user_profile can only has one user KYC
        // locale=my-MM&filters[user_profile][id][$eq]=96
        const entity = await strapi.service('api::user-kyc.user-kyc').find({
          locale: ctx.query.locale,
          filters: {
            user_profile: {
              id: {
                $eq: userId,
              },
            },
          },
        });

        if (entity.results.length > 0) {
          ctx.params.id = entity.results[0].id;
        }
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
    if (ctx.state?.user && ctx.request.body.data.locale) {

      delete ctx.request.body.data.is_approved;
      delete ctx.request.body.data.is_rejected;
      delete ctx.request.body.data.rejected_reason;

      response = await this.update(ctx);
      if (!response.data) {
        ctx.request.body.data.user_profile = ctx.state.user.id;
        response = await super.create(ctx);
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
        status: 401,
        name: "UnauthorizedError",
        message: "Required valid authentication"
      }
    };
    if (ctx.state?.user && ctx.request.body.data.locale) {
      delete ctx.params.id;
      delete ctx.request.url;

      const userId = ctx.state.user.id;

      // Find existing user KYC, where one locale of a user_profile can only has one user KYC
      // locale=my-MM&filters[user_profile][id][$eq]=96
      const entity = await strapi.service('api::user-kyc.user-kyc').find({
        locale: ctx.request.body.data.locale,
        filters: {
          user_profile: {
            id: {
              $eq: userId,
            },
          },
        },
      });
      if (entity.results.length > 0) {
        ctx.params.id = entity.results[0].id;

        ctx.request.body.data.is_rejected = false;
  
        delete ctx.request.body.data.is_approved;
        delete ctx.request.body.data.rejected_reason;
        delete ctx.request.body.data.id;
        delete ctx.request.body.data.user_profile;
  
        response = await super.update(ctx);
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
