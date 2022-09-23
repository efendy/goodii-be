'use strict';

/**
 * website-about service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-about.website-about');
