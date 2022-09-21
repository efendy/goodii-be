'use strict';

/**
 * website-discover service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-discover.website-discover');
