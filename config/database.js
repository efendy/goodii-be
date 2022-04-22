module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '34.124.186.149'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'growfi-strapi-uat'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'pxjBmHIAvccO9IB7'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
