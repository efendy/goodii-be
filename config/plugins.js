module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('GCS_BUCKET_NAME'),
        basePath: env('GCS_BASE_PATH'),
        baseUrl: env('GCS_BASE_URL'),
        publicFiles: true,
        uniform: false,
        serviceAccount: env.json('GCS_SERVICE_ACCOUNT'),
      },
    },
  },
});
