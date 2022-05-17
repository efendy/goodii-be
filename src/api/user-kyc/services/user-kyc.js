'use strict';

/**
 * user-kyc service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-kyc.user-kyc');
