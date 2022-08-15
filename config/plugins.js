const fs = require('fs');

module.exports = ({ env }) => ({
  publisher: {
		enabled: true,
	},
  menus: {
    config: {
      maxDepth: 3,
    },
  },
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
          privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQCb8cc/hX2tl/cvC8jDVWzvn1JF+lCnCjz2XGEx8ogmLmfNWwMi\nLxKwoBvrYyDvE6iCd7iGWe29ynaXqmhhCufR3H/2rxhMZaD/EwfF/cAbJnn7KUTC\noUBZm505EYUsNcaIV0pxwWM2v/MR4AIb36+P8B1/OHEkoSbYpamWuptSAwIDAQAB\nAoGBAIJzW/EYU0zvLdjOK9CzWmCNT364adWCLAMOvkPRFfGSqkTQGKv04tab6R8c\nmoVEVZdmXRcOjWFRx6kR5SUgwVCvrWlsx/9PFb/y7WN4/ysBG7antwgjDN8yVGBD\nsGApg8DF22TBs07EjjGpkWO4YdDL4+zig1iPukZW2YXMEHbhAkEAydKrWFJPRZMS\nKV/mlUdM3vJvGNABUVz8U/F5qlduH2xOt4CE7Wl0LemZusOozZNYS1LeeDnfE0tb\nu2W4CXFDUwJBAMXOU41FH0TMirtWMM5pDPZkbanSAKUlKYRNeIvwchv00b30FEMb\nQxUZG1DDnXK8NclenMeXvqZazucjHBzlEJECQGS4D+6Z1RnBlbS0OVySIpi4oBzf\n4Wh7YSl7Pt51l21zHa2SI8Rfdi1bgO6lql49hDjC+GdDakI0v2i8EKYVsiUCQGyr\n5wE02XHtwcYcGyI7WpC/KfRjWFFickWqXjDbf4VWYiiuwLcBckBUE8qyPXz8Y7xm\ny1FoT6iLOSKJCnfhbNECQQC4AvMvhb1FQYWwogYqcBV3jd3y7IfozXOI14E5sku6\n3SQQxfiBzmsOZ3Gs+nVazqtDnwFI99qoEqt/BwrV8TxH\n-----END RSA PRIVATE KEY-----',
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
