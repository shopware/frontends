"use strict";

const constants = require("./constants");
const crypto = require("crypto");
const axios = require("axios");

module.exports = {
  signHeaders: signHeaders,
  signPayload: signPayload,
  retryLogic: retryLogic,
  sendRequest: sendRequest,
  invokeApi: invokeApi,
  prepareOptions: prepareOptions,
  enhanceResponseWithShippingAddressList:
    enhanceResponseWithShippingAddressList,
};

function getTimestamp() {
  const date = new Date();
  return date.toISOString().split(".")[0] + "Z";
}

function getAPIEndpointBaseURL(configArgs) {
  if (
    configArgs.overrideServiceUrl &&
    configArgs.overrideServiceUrl.length > 0
  ) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // devo environment using self-signed certificate
    return configArgs.overrideServiceUrl;
  } else
    return constants.API_ENDPOINTS[
      constants.REGION_MAP[configArgs.region.toLowerCase()]
    ];
}

function invokeApi(configArgs, apiOptions, maxRedirects) {
  const options = {
    method: apiOptions.method,
    json: false,
    headers: apiOptions.headers,
    url: `https://${getAPIEndpointBaseURL(configArgs)}/${apiOptions.urlFragment}${getQueryString(apiOptions.queryParams)}`,
    data: apiOptions.payload,
    maxRedirects: maxRedirects,
    validateStatus: (status) => {
      return (
        (status >= 200 && status < 300) ||
        (maxRedirects === 0 && status === 303)
      );
    },
  };

  const response = this.retryLogic(options, 1);

  return response;
}

function getQueryString(requestParams) {
  if (requestParams) return `?${getParametersAsString(requestParams)}`;
  return "";
}

function getParametersAsString(requestParams) {
  if (!requestParams) return "";

  let queryParams = [];
  Object.keys(requestParams)
    .sort()
    .forEach(function (param) {
      queryParams.push(`${param}=${encodeURIComponent(requestParams[param])}`);
    });
  return queryParams.join("&");
}

function prepareOptions(configArgs, options) {
  options.headers = options.headers || {};

  // if user doesn't pass in a string, assume it's a JS object and convert it to a JSON string
  if (
    !(typeof options.payload === "string" || options.payload instanceof String)
  ) {
    options.payload = JSON.stringify(options.payload);
  }
  // Condition to validate PublicKeyId is Environment specific
  if (isEnvSpecificPublicKeyId(configArgs["publicKeyId"])) {
    options.urlFragment = `${constants.API_VERSION}/${options.urlFragment}`;
  } else {
    if (configArgs["sandbox"] === true || configArgs["sandbox"] === "true") {
      options.urlFragment = `sandbox/${constants.API_VERSION}/${options.urlFragment}`;
    } else {
      options.urlFragment = `live/${constants.API_VERSION}/${options.urlFragment}`;
    }
  }
  return options;
}

// Method used to validate whether PublicKeyId starts with prefix LIVE or SANDBOX
function isEnvSpecificPublicKeyId(publicKeyId) {
  return (
    publicKeyId.toUpperCase().startsWith("LIVE") ||
    publicKeyId.toUpperCase().startsWith("SANDBOX")
  );
}

function sign(privateKey, stringToSign, algorithm) {
  const sign = crypto.createSign("RSA-SHA256").update(stringToSign);
  return sign.sign(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: algorithm.saltLength,
    },
    "base64",
  );
}

function getAlgorithm(algorithm) {
  if (!algorithm) return constants.AMAZON_SIGNATURE_ALGORITHM.DEFAULT;

  for (const [key, value] of Object.entries(
    constants.AMAZON_SIGNATURE_ALGORITHM,
  )) {
    if (value.name === algorithm) {
      return constants.AMAZON_SIGNATURE_ALGORITHM[key];
    }
  }
  throw "Not a valid algorithm";
}

function retryLogic(options, count) {
  const response = this.sendRequest(options, count);

  if (count > constants.RETRIES) {
    return response
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  return response
    .then(function (result) {
      return result;
    })
    .catch((err) => {
      if (
        response.statusCode === 408 ||
        response.statusCode === 425 ||
        response.statusCode === 429 ||
        response.statusCode >= 500
      ) {
        return this.retryLogic(options, (count += 1));
      } else {
        return Promise.reject(err);
      }
    });
}

function sendRequest(options, count) {
  const delayTime = count === 1 ? 0 : 2 ** (count - 1) * 1000;

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      axios
        .request(options)
        .then((response) => {
          if (response.status >= 400) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }, delayTime);
  });
}

/* Expected options:
       options.method
       options.urlFragment
       options.payload
       options.headers
*/
function signHeaders(configArgs, options) {
  const headers = {};

  Object.assign(headers, options.headers);

  headers["x-amz-pay-region"] =
    constants.REGION_MAP[configArgs.region.toLowerCase()];
  headers["x-amz-pay-host"] = getAPIEndpointBaseURL(configArgs);
  headers["x-amz-pay-date"] = getTimestamp();
  headers["content-type"] = "application/json";
  headers["accept"] = "application/json";
  headers["user-agent"] =
    `amazon-pay-api-sdk-nodejs/${constants.SDK_VERSION} (JS/${process.versions.node}; ${process.platform})`;

  const lowercaseSortedHeaderKeys = Object.keys(headers).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  const signedHeaders = lowercaseSortedHeaderKeys.join(";");

  let payload = options.payload;
  if (payload === null || payload === undefined) {
    payload = "";
  }

  let canonicalRequest =
    options.method +
    "\n/" +
    options.urlFragment +
    "\n" +
    getParametersAsString(options.queryParams) +
    "\n";
  lowercaseSortedHeaderKeys.forEach(
    (item) =>
      (canonicalRequest += item.toLowerCase() + ":" + headers[item] + "\n"),
  );
  canonicalRequest +=
    "\n" +
    signedHeaders +
    "\n" +
    crypto.createHash("SHA256").update(payload).digest("hex");

  const algorithm = getAlgorithm(configArgs.algorithm);
  const stringToSign =
    algorithm.name +
    "\n" +
    crypto.createHash("SHA256").update(canonicalRequest).digest("hex");

  const signature = sign(configArgs.privateKey, stringToSign, algorithm);

  headers["authorization"] =
    algorithm.name +
    " PublicKeyId=" +
    configArgs["publicKeyId"] +
    ", SignedHeaders=" +
    signedHeaders +
    ", Signature=" +
    signature;

  return headers;
}

function signPayload(configArgs, payload) {
  // if user doesn't pass in a string, assume it's a JS object and convert it to a JSON string
  if (!(typeof payload === "string" || payload instanceof String)) {
    payload = JSON.stringify(payload);
  }
  const algorithm = getAlgorithm(configArgs.algorithm);
  const stringToSign =
    algorithm.name +
    "\n" +
    crypto.createHash("SHA256").update(payload).digest("hex");

  return sign(configArgs.privateKey, stringToSign, algorithm);
}

function enhanceResponseWithShippingAddressList(response) {
  if (response.data.shippingAddressList != null) {
    response.data.shippingAddressList = response.data.shippingAddressList.map(
      (shippingAddress) => JSON.parse(shippingAddress),
    );
  }
  return response;
}
