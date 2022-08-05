const fs = require('fs');

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
  email: {
    config: {
      provider: 'sendmail',
      providerOptions: {
        dkim: {
          privateKey: fs.existsSync('./dkim-private-goodii.pem') ? fs.readFileSync('./dkim-private-goodii.pem', 'utf8') : null,
          keySelector: 'growfi._domainKey',
        },
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLYTO'),
      },
    }
  },
  'import-export-entries': {
    enabled: false,
  },
});
