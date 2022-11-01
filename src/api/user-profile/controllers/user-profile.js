"use strict";

/**
 *  user-profile controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const dayjs = require("dayjs");

module.exports = createCoreController(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
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
          message: "Required valid authentication",
        },
      };
      if (ctx.state?.user) {
        const userId = ctx.state.user?.id;
        console.log(ctx.request.body);

        if (ctx.request.body.data.birthday) {
          ctx.request.body.data.birthday = String(
            ctx.request.body.data.birthday
          ).split("T")[0];
        }

        //   const now = dayjs();
        //   const birthday = dayjs(ctx.request.body.data.birthday);
        //   const age = now.diff(birthday, "year");

        //   console.log(`User profile age: ${age} | ${now.toString()} | ${birthday.toString()}`);

        //   const entity = await strapi.service('api::configuration.configuration').find(ctx.query.locale ? {
        //     locale: ctx.query.locale
        //   } : {});
        //   if (entity) {
        //     const { min_age } = entity;

        //     if (parseInt(min_age) > 0 && parseInt(age) < parseInt(min_age)) {
        //       isContinue = false;
        //       response.error = {
        //         status: 400,
        //         name: "Minimum Age",
        //         code: "user_profile_min_age",
        //         message: `Sorry! User's minimum age is ${min_age}`
        //       }
        //     }
        //   }
        // }
        ctx.request.body.data.id = userId;
        response = await this.update(ctx);
        if (!response) {
          ctx.request.body.data.id = userId;

          const userEntry = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
              where: { id: userId },
            });
          const userMobile = userEntry.provider_data?.providerData?.find(
            (o) => o.providerId === "phone"
          );
          const userEmail = userEntry.provider_data?.providerData?.find(
            (o) => o.providerId === "email"
          );

          if (userMobile) {
            ctx.request.body.data.phone_mobile = userMobile.uid;
          }
          if (userEmail) {
            ctx.request.body.data.email = userEmail.uid;
          }

          console.log(ctx.request.body.data);
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
          message: "Invalid Request",
        },
      };
      return response;
    },

    async update(ctx) {
      let response = {
        data: null,
        error: {
          status: 401,
          name: "UnauthorizedError",
          message: "Required valid authentication",
        },
      };
      if (ctx.state?.user) {
        ctx.params.id = ctx.state.user.id;

        delete ctx.request.body.data.uid;
        delete ctx.request.body.data.id;

        if (ctx.request.body.data.birthday) {
          ctx.request.body.data.birthday = String(
            ctx.request.body.data.birthday
          ).split("T")[0];
        }

        //   const now = dayjs();
        //   const birthday = dayjs(ctx.request.body.data.birthday);
        //   const age = now.diff(birthday, "year");

        //   console.log(`User profile age: ${age} | ${now.toString()} | ${birthday.toString()}`);

        //   const entity = await strapi.service('api::configuration.configuration').find(ctx.query.locale ? {
        //     locale: ctx.query.locale
        //   } : {});
        //   if (entity) {
        //     const { min_age } = entity;

        //     if (parseInt(min_age) > 0 && parseInt(age) < parseInt(min_age)) {
        //       isContinue = false;
        //       response.error = {
        //         status: 400,
        //         name: "Minimum Age",
        //         message: `Sorry! User's minimum age is ${min_age}`
        //       }
        //     }
        //   }
        // }

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
          message: "Invalid Request",
        },
      };
      return response;
    },
  })
);
