'use strict';

/**
 *  shop controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shop.shop', ({ strapi }) =>  ({

  async findOne(ctx) {
    let response;
    if (ctx.params.id == "me" && ctx.state?.user?.id) {
      const userId = ctx.state?.user?.id;

      delete ctx.params.id;
      
      ctx.request.url += `&filters[owner_id][$eq]=${userId}`;

      response = await super.find(ctx);
    } else {
      response = await super.findOne(ctx);
    }
    return response;
  },

  async find(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    const {locale, latitude, longitude, distance, pagination} = ctx.query;
    const isGeoQuery = latitude && longitude && distance;
    delete ctx.query.latitude;
    delete ctx.query.longitude;
    delete ctx.query.distance;

    if (isGeoQuery) {
      if (locale && distance >= 1) {
        const knex = strapi.db.connection;
        
        // Handling pagination when querying
        // Sort distance from nearest to furthest
        const pageDefaultSize = strapi.config.get('api.rest.defaultLimit');
        const pageMaxSize = strapi.config.get('api.rest.maxLimit');
        const paginationPageSize = parseInt(pagination?.pageSize || pageDefaultSize);
        const pageSize = (paginationPageSize < 1 ? 1 : paginationPageSize > pageMaxSize ? pageMaxSize : paginationPageSize)
        const paginationPage = (parseInt(pagination?.page) || 1) ;
        const page = (paginationPage < 1 ? 1 : paginationPage);

        const results = await knex.with(
            'with_alias', 
            knex.raw(
              `SELECT id, ROUND((ST_Distance_Sphere(point(shops.geo_lng, shops.geo_lat), point(${longitude}, ${latitude})))) AS distance_in_m from shops`
            )
          ).select('*')
          .from('with_alias')
          .where('distance_in_m', '<=', distance * 1000)
          .orderBy('distance_in_m')
          .limit(pageSize)
          .offset((page - 1) * pageSize);
        
        // Remove query pagination to avoid paginating results
        delete ctx.query.pagination;

        // Finding shops by ids
        ctx.query.filters = {
          id: {
            $in: results.map(value => value.id),
          },
        };
        const entities = await super.find(ctx);

        response = {
          data: entities.data,
          meta: {
            pagination: {
              page: page,
              pageSize: entities.data.length,
            },
          },
        };
      } else {
        response.error.message = "Required locale, lat, lng and distance. distance is in meter and it must be greater than or equal to 1."
      }
    } else {
      response = super.find(ctx);
    }
    return response;
  },

  async create(ctx) {
    ctx.request.body.data.user_profile = ctx.state.user.id;
    ctx.request.body.data.is_approved = false;
    ctx.request.body.data.is_rejected = false;
    ctx.request.body.data.rejected_reason = "";
    
    delete ctx.request.body.data['owner_id'];

    const response = await super.create(ctx);
    return response;
  },

  async createMany(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    return response;
  },

  async update(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    if (ctx.state?.user) {
      const userId =  ctx.state.user.id;
      const entry = await super.findOne(ctx);
      if (entry) {
        if (entry.data.attributes['owner_id'] == userId) {

          ctx.request.body.data.is_rejected = false;
          
          delete ctx.request.body.data.is_approved;
          delete ctx.request.body.data.rejected_reason;
          delete ctx.request.body.data.uid;
          delete ctx.request.body.data.owner_id;
          delete ctx.request.body.data.user_profile;

          response = await super.update(ctx);
        } else {
          response.error = { status: 401, name: "Unauthorized", message: `Not allow to update id ${ctx.params.id}` };
        }
      } else {
        response.error = { status: 404, name: "Not Found", message: `Invalid id ${ctx.params.id}` };
      }
    }

    return response;
  },

  async updateMany(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    return response;
  },

  async near(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };
    const {locale, latitude, longitude, distance, pagination} = ctx.query;
    const isGeoQuery = latitude && longitude && distance;
    delete ctx.query.latitude;
    delete ctx.query.longitude;
    delete ctx.query.distance;

    if (isGeoQuery) {
      if (locale && distance >= 1) {
        const knex = strapi.db.connection;
        const pageDefaultSize = strapi.config.get('api.rest.defaultLimit');
        const pageMaxSize = strapi.config.get('api.rest.maxLimit');
        const paginationPageSize = parseInt(pagination?.pageSize || pageDefaultSize);
        const pageSize = (paginationPageSize < 1 ? 1 : paginationPageSize > pageMaxSize ? pageMaxSize : paginationPageSize)
        const paginationPage = (parseInt(pagination?.page) || 1) ;
        const page = (paginationPage < 1 ? 1 : paginationPage);
        const results = await knex.with(
            'with_alias', 
            knex.raw(
              `SELECT id, ROUND((ST_Distance_Sphere(point(shops.geo_lng, shops.geo_lat), point(${longitude}, ${latitude})))) AS distance_in_m from shops`
            )
          ).select('*')
          .from('with_alias')
          .where('distance_in_m', '<=', distance * 1000)
          .orderBy('distance_in_m')
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        ctx.query.filters = {
          id: {
            $in: results.map(value => value.id),
          }
        };
        delete ctx.query.pagination;
        const entities = await super.find(ctx);
        response = {
          data: entities.data,
          meta: {
            pagination: {
              page: page,
              pageSize: entities.data.length,
            }
        }
        };
      } else {
        response.error.message = "Required locale, lat, lng and distance. distance is in meter and it must be greater than or equal to 1."
      }
    }
    return response;
  },
}));
