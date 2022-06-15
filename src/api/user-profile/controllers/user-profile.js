'use strict';

/**
 *  user-profile controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const dayjs = require('dayjs');

module.exports = createCoreController('api::user-profile.user-profile', ({ strapi }) =>  ({

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
      console.log(ctx.request.body);

      if (ctx.request.body.data.birthday) {
        ctx.request.body.data.birthday = String(ctx.request.body.data.birthday).split("T")[0];
        
        const now = dayjs();
        const birthday = dayjs(ctx.request.body.data.birthday);
        const age = now.diff(birthday, "year");

        console.log(`User profile age: ${age} | ${now.toString()} | ${birthday.toString()}`);
      }
      
      // @TODO Check Birthday greater or equal than 18 years

      response = await this.update(ctx);
      if (!response) {
        ctx.request.body.data.id = ctx.state.user.id;
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
    if (ctx.state?.user) {
      ctx.params.id = ctx.state.user.id;

      delete ctx.request.body.data.uid;
      delete ctx.request.body.data.id;

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
