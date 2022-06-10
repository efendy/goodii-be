'use strict';

/**
 *  payment-gateway controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment-gateway.payment-gateway');
