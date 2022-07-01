'use strict';

/**
 * flagged-listing service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::flagged-listing.flagged-listing');
