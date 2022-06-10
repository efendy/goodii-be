'use strict';

/**
 * payment-gateway router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::payment-gateway.payment-gateway');
