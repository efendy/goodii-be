'use strict';

/**
 * website-community service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-community.website-community');
