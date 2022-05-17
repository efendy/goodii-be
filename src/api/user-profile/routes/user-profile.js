'use strict';

/**
 * user-profile router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::user-profile.user-profile");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const additionalRoutes = [
  // {
  //   method: "PUT",
  //   path: "/user-profiles/me",
  //   handler: "api::user-profile.user-profile.update",
  // },
  // {
  //   method: "GET",
  //   path: "/user-profiles/me",
  //   handler: "api::user-profile.user-profile.findMe",
  // },
];

module.exports = customRouter(defaultRouter, additionalRoutes);