"use strict";

module.exports = {
  SDK_VERSION: "2.3.4",
  API_VERSION: "v2",
  RETRIES: 3,
  DEFAULT_REDIRECT: 5,
  API_ENDPOINTS: {
    na: "pay-api.amazon.com",
    eu: "pay-api.amazon.eu",
    jp: "pay-api.amazon.jp",
  },
  REGION_MAP: {
    na: "na",
    us: "na",
    de: "eu",
    uk: "eu",
    eu: "eu",
    jp: "jp",
  },
  AMAZON_SIGNATURE_ALGORITHM: {
    DEFAULT: { name: "AMZN-PAY-RSASSA-PSS", saltLength: 20 },
    V2: { name: "AMZN-PAY-RSASSA-PSS-V2", saltLength: 32 },
  },
  ACCOUNT_MANAGEMENT: "merchantAccounts",
  DISPUTES: "disputes",
  CONTEXT: "contest",
  FILES: "files",
};
