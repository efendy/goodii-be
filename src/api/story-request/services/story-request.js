'use strict';

/**
 * story-request service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::story-request.story-request');
