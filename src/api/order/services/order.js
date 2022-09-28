"use strict";

/**
 * order service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const fetch = require("node-fetch");

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  /**
   *
   * userId from `user-profile`
   * isCloudMessage as boolean to trigger cloud messaging
   * storeInNoti as boolean to add in `notification` table
   */
  async sendNotification({ userId, title, body, isCloudMessage, storeInNoti }) {
    const data = await strapi.entityService.findOne(
      "api::user-profile.user-profile",
      userId,
      { populate: "pushtokens" }
    );
    if (isCloudMessage && data?.pushtokens?.length > 0) {
      const isFCM =
        data.pushtokens?.filter((x) => x.provider === "fcm")?.length > 0;
      const tokens = data.pushtokens.map((x) => x.token);

      const fnNotiUrl = `${process.env?.FN_BASE_URL}/v2-notification-send`;
      const notiData = {
        tokens: tokens,
        notification: { title, body },
        isPushyMe: !isFCM,
      };

      await fetch(fnNotiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notiData),
      });
      console.log("noti sent!");
    }
    if (storeInNoti) {
      await strapi.entityService.create("api::notification.notification", {
        data: {
          title,
          message: body,
          user_profile: data.id,
          locale: data.app_country,
          type: "order",
        },
      });
      console.log("noti added in strapi!");
    }
  },
}));
