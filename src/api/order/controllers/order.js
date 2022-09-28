"use strict";

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const dayjs = require("dayjs");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async findOne(ctx) {
    const { uid } = ctx.params;

    ctx.params.id =
      (
        await strapi.db.query("api::order.order").findOne({
          where: { uid },
        })
      )?.id || 0;

    return await super.findOne(ctx);
  },

  async create(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request",
      },
    };

    if (ctx.state?.user) {
      const userId = ctx.state.user.id;
      const listingId = ctx.request.body.data["listing_id"];

      if (listingId) {
        const orderEntity = await strapi.db.query("api::order.order").findOne({
          where: {
            $and: [
              { listing_id: listingId },
              { owner_id: userId },
              { is_open: true },
            ],
          },
        });

        if (orderEntity) {
          const sanitizedOrderEntity = await this.sanitizeOutput(orderEntity);
          response = this.transformResponse(sanitizedOrderEntity);
        } else {
          const listingEntity = await strapi.db
            .query("api::listing.listing")
            .findOne({
              select: ["owner_id"],
              where: { id: listingId },
              populate: {
                shop: true,
              },
            });
          if (listingEntity) {
            const listingOwnerId = parseInt(listingEntity["owner_id"] ?? 0);
            const shopId = parseInt(listingEntity["shop"]["id"] ?? 0);
            if (listingOwnerId > 0 && listingOwnerId == userId) {
              response.error = {
                status: 401,
                name: "Unauthorized",
                message: "Not allow to create order for self",
              };
            } else {
              ctx.request.body.data["shop"] = shopId;
              ctx.request.body.data["shop_id"] = shopId;
              ctx.request.body.data["listing_owner_id"] = listingOwnerId;
              ctx.request.body.data["user_profile"] = userId;
              ctx.request.body.data["owner_id"] = userId;
              ctx.request.body.data["is_open"] = true;
              ctx.request.body.data["status"] = "open";
              ctx.request.body.data["status_payment"] = "none";
              ctx.request.body.data["status_fulfillment"] = "open";
              response = await super.create(ctx);

              const title = "Goodii | Order";
              await strapi.service("api::order.order").sendNotification({
                userId: ctx.request.body.data["owner_id"],
                title,
                body: ORDER_BUYER_MESSAGE[orderStatus],
                isCloudMessage: true,
                storeInNoti: true,
              });

              await strapi.service("api::order.order").sendNotification({
                userId: ctx.request.body.data["listing_owner_id"],
                title,
                body: ORDER_SELLER_MESSAGE[orderStatus],
                isCloudMessage: true,
                storeInNoti: true,
              });
            }
          } else {
            response.error = {
              status: 404,
              name: "Not Found",
              message: "Listing does not exist.",
            };
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
        message: "Invalid Request",
      },
    };
    return response;
  },

  async update(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request",
      },
    };

    const { pipeline } = ctx.query;

    if (ctx.state?.user || pipeline === "admin") {
      const userId = ctx.state.user.id || 0;
      const { uid } = ctx.params;

      const entry = await strapi.db.query("api::order.order").findOne({
        where: { uid },
      });

      if (entry) {
        // Only allow to update order, who created it or listing owner.
        if (
          entry["owner_id"] == userId ||
          entry["listing_owner_id"] == userId ||
          pipeline == "admin"
        ) {
          ctx.params.id = entry["id"];

          delete ctx.request.body.data["uid"];
          delete ctx.request.body.data["listing"];
          delete ctx.request.body.data["user_profile"];
          delete ctx.request.body.data["listing_owner_id"];
          delete ctx.request.body.data["owner_id"];
          delete ctx.request.body.data["shop"];
          delete ctx.request.body.data["shop_id"];

          switch (ctx.request.body.data["status"]) {
            case "rejected":
            case "completed":
              ctx.request.body.data["is_open"] = false;
              break;
            case "paid":
              ctx.request.body.data["paid_at"] = dayjs().format(
                "YYYY-MM-DDTHH:mm:ss.SSSZ"
              ); //"2022-08-22T16:03:00.000Z"
            default:
              ctx.request.body.data["is_open"] = true;
          }

          const orderStatus = ctx.request.body.data["status"];

          console.log(orderStatus);

          if (orderStatus !== entry["status"]) {
            const title = "Goodii | Order";

            await strapi.service("api::order.order").sendNotification({
              userId: entry["owner_id"],
              title,
              body: ORDER_BUYER_MESSAGE[orderStatus],
              isCloudMessage: true,
              storeInNoti: true,
            });

            await strapi.service("api::order.order").sendNotification({
              userId: entry["listing_owner_id"],
              title,
              body: ORDER_SELLER_MESSAGE[orderStatus],
              isCloudMessage: true,
              storeInNoti: true,
            });
          }

          response = await super.update(ctx);
        } else {
          response.error = {
            status: 401,
            name: "Unauthorized",
            message: `Not allow to update uid ${uid}`,
          };
        }
      } else {
        response.error = {
          status: 404,
          name: "Not Found",
          message: `Invalid uid ${uid}`,
        };
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
        message: "Invalid Request",
      },
    };
    return response;
  },

  async getMonthlyEarning(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request",
      },
    };
    if (ctx.state?.user) {
      // Only listing owner
      const userId = ctx.state.user.id;
      const { shopId } = ctx.params;

      const knex = strapi.db.connection;
      const results = await knex("orders")
        .select(
          knex.raw(
            "SUM(net_amount) as total, YEAR(paid_at) as year, MONTH(paid_at) as month"
          )
        )
        .where(
          knex.raw(
            `shop_id = ${shopId} AND listing_owner_id = ${userId} AND status = 'completed' AND is_open = FALSE`
          )
        )
        .groupByRaw("YEAR(paid_at), MONTH(paid_at)");

      return this.transformResponse({ results });
    }
    return response;
  },
}));

const ORDER_BUYER_MESSAGE = {
  open: "Your order is submitted",
  rejected: "Your order is rejected",
  confirmed: "Your order is confirmed",
  paid: "Your order is paid",
  ready: "Your order is ready",
};

const ORDER_SELLER_MESSAGE = {
  open: "You have submitted order",
  rejected: "Order rejected",
  confirmed: "You have confirmed order",
  paid: "Order is paid",
  ready: "Order is ready",
};
