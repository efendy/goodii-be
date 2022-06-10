'use strict';

/**
 * payment-gateway service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-gateway.payment-gateway');
