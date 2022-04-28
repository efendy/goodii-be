module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: 'growfi-test.appspot.com',
        basePath: 'strapi',
        baseUrl: 'http://34.110.136.213',
        publicFiles: true,
        uniform: false,
        serviceAccount: {
          type: "service_account",
          project_id: "growfi-test",
          private_key_id: "91b079f951c26483d88474a6b111188fe48ccfc1",
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDP/Jz6i7ASAydV\nmpAP9QsWKvSuy+P9gc5/kBnA8T/vXWinkTS1SFPdikBlFT7d1Dy8aQMpeQ266xc3\nQWe0mGbWwC8wa7Ew4gSQlnWJUlEnepYxkV6cbwaFeSqoUnU2rNP3GI+5sxqLtgAX\nrO1iKxY91nC+AgQZn1qgkdMKq5iiW7r1I745yp/ToK87fHcKKUtsYvKhQcMXGgGj\nrJnijAhkkSvCvb5Rpe5iMtT96qDS54a6xYUakEQbB9W1RiyC/48mNt+ddz3WWBLP\nIpjiDLeWQ7H2c1ClNZ+yXXXr+Pr9ccbr5J1t/A1/wphRQifKRa1YeceqZYTvoOcL\ndVREaQfFAgMBAAECggEAJ9HWLxy73LL4XqoNH1T7pqaaOnYERCaMRb1txNQbeMUy\nMnS5OeTrU4yyx/eRlfBaoXrcdV39DDaStwxBYeDUvZRFZJiVr8Vx+Mmpnp0hNvUA\nGOTbT4ltHvRD/75rvQhJO7Na3wOEl0+ExIOh3ivgIf4yjxo9NTeeZwQMOux/+ENN\ntK2JuDn/RtwfoLKpVkdaF8GhwuaHHBIn5ejv4rQzcyuprXZYTSJ42Q5CMuqQTuP4\notLjksNfHBOfCZZuPpJOskMVcQcqgvkYb26ByBqkrXnB8W23qQFmzajxaJ1IfSVT\nhAkt5xQRVSeap3AbWSIaPXQuljt23HH8ezMluOyCiQKBgQDzVXV5bjGkVtv8egrJ\nqZn52/NTGP9IcuikGw3iG+hp/MxJZEShSbBpQKVj8tanpEvEm3uuOX9frh0AiPub\ndNcy5VIBdpI5kgCAI7SyktRlchRHcHynNVNKOp6YtYUxqVTB5ndrhPeyxqeZS+XR\nDpGcLU9j1PklW1bKIlrLMvdw+QKBgQDa0CNALxfH9S2PIXl4btU4s3p+ENdBszWD\nTE1gMuUhF+932SEv2mi+4s0hCj8QlHq5ubuL9On8kXbgL7Gw+HAPkV9faX4UB8tb\nJIWESBSdfJuFvKe/L+OkvzokWeyDZODKyLQfKOoRLSXqZdsbMqSZYyR46V8HKP5v\nYAy/8LKMLQKBgAkkJrufFiJUWQNNGmalBnHKf4OZps1z86Vmlsjtv3dr1cjUCXf9\nqrDpis0MbF/z3hzOsoDDDDPt+IzymHEonIT+9Gu1ppyfDYHC1aD3vx7ogDaG1Uf6\nytw5A4g9GXnaIKMAI3BYmG2Q5O7vWPzXjUTOtvLLJ2jt237Qd5S2n3ERAoGAdkyh\nQkozqT+86e1HJv2E+arPRukD99lTzTCrhJ7/kezG4xzY/G4ww0MLdBl+DxC3aUIp\nS3mWJ57djkc64lru+vu1fHgkWd/86cHNDb+KpbqAusVMS+kwQhnA7XZQkJkxj3ED\nMPWF1tN59EgtNX8jzmnzhgtl/REEvmJHgl43qeECgYBrwdYT7UsImhx4rnJHJPW5\nIg4WKKKr/855g1xOfBWkzI90jQ9XnDDrk+xhsqVqP6T3l4uXQHvWEBHO5PRn5TeK\nexTP72bZA4SLlVNhNfHbyGO7/P5hX8WYK2qapZUSDegBLRdlZwqKKvmmrGvgxQOV\ncgAS3DVyY6ZKd8egta1Jyg==\n-----END PRIVATE KEY-----\n",
          client_email: "firebase-adminsdk-th7i8@growfi-test.iam.gserviceaccount.com",
          client_id: "102551316018400868701",
          client_id: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-th7i8%40growfi-test.iam.gserviceaccount.com"
        },
      },
    },
  },
});
