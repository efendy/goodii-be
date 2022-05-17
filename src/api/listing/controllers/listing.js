'use strict';

/**
 *  listing controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::listing.listing', ({ strapi }) => ({
    async findOne(ctx) {
        // Calling the default core action
        const { data, meta } = await super.find(ctx);

        if (data.length == 0) {
            return { data, meta };
        }

        const entry = await strapi.entityService.update('api::listing.listing', data[0].id, {
            data: {
                viewed: data[0].attributes.viewed + 1,
            },
        });

        data[0].attributes.viewed++;

        return { data, meta };
    }
}));
