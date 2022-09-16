'use strict';

/**
 * website-home service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-home.website-home');
