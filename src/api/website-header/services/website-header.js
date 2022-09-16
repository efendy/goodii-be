'use strict';

/**
 * website-header service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-header.website-header');
