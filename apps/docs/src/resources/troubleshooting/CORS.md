# Dealing with CORS in Your Project

## Introduction

[SOP](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) (Same-Origin Policy) and [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (Cross-Origin Resource Sharing) are both security mechanisms in web development, but they serve different purposes and work together to control how web pages interact with resources from different origins.

| Feature | SOP (Same-Origin Policy) | CORS (Cross-Origin Resource Sharing) |
|------------|----------|----------|
| Purpose | Restricts cross-origin requests	 | Allows controlled cross-origin requests |
| Default Behavior | Blocks requests between different origins | Allows if explicitly permitted by the server |
| Enforcement | Enforced by browsers automatically | Implemented by servers using HTTP headers |
| Example Restriction | JavaScript from A.com cannot access B.com | Server B.com can allow access to A.com via CORS headers |

In headless architecture, the frontend and backend are decoupled, and the frontend is hosted on a different domain than the backend. This architecture is common in modern web development, but it can cause issues with SOP and CORS like:

- **Blocked requests**: The browser blocks requests from the frontend to the backend due to SOP.
- **Blocked resources**: The browser blocks resources like fonts, images, and scripts from different origins due to CORS.
- **Blocked cookies**: The browser blocks cookies from different origins due to SOP.
- **Blocked API requests**: The browser blocks API requests from the frontend to the backend due to CORS (preflight requests, OPTIONS requests, sending credentials, custom headers, HTTP methods).

In this guide, you will learn how to deal with CORS issues in your project.

## Headless setup

- Your Nuxt.js frontend is hosted at https://nuxtfrontend.com.
- Your Shopware 6 Store API is hosted at https://shopware.com/store-api.

By default, the browser blocks requests due to SOP (Same-Origin Policy) unless the API explicitly allows it by relaxing the SOP restrictions using CORS.

### Enabling cross-origin requests

To enable cross-origin requests, the server must send the following CORS headers:
- `Access-Control-Allow-Origin`: The origin that is allowed to access the resource.
- `Access-Control-Allow-Methods`: The HTTP methods that are allowed to access the resource.
- `Access-Control-Allow-Headers`: The headers that are allowed to access the resource.

In case of Shopware 6 itself, the API is already configured to allow cross-origin requests from any origin. 

The setup can be similar as follows:
 

| CORS Header | Default Configuration | Description |
|-------------|----------------------|-------------|
| `Access-Control-Allow-Origin` | `*` | Allows requests from any origin, though specifying origins explicitly is recommended for security |
| `Access-Control-Allow-Methods` | `GET,POST,PUT,PATCH,DELETE` | HTTP methods permitted for cross-origin requests |
| `Access-Control-Allow-Headers` | `Content-Type,Authorization,sw-context-token,sw-access-key,sw-language-id,sw-version-id,sw-inheritance,indexing-behavior,sw-include-seo-urls,sw-context-token-alias` | Headers that can be used in requests to the API |

As we can see, the Shopware 6 API allows cross-origin requests from any origin, also any method and the set of Shopware specific headers, like `sw-context-token` and `sw-access-key` - both known from [API Client](https://www.npmjs.com/package/@shopware/api-client#:~:text=Store%20API%20client%20setup) setup.

That enables the frontend project to communicate with the Shopware 6 API without any additional configuration for CORS.


## CORS issues

### Preflight OPTIONS requests

A browser knows that requests used to communicate between frontend app and Shopware 6 API aren't [simple](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests). Thus There is no way to avoid such requests in the browser due to additional headers or credentials needed by Shopware 6 API. To work around this see the next section.

### Any other problem

Eliminate the browser's CORS restrictions by using a server-side proxy or a custom API middleware (don't do any requests in the browser side):

- **If you control the backend:** Use **Reverse Proxy (NGINX)** or **update Shopware's CORS settings**.
- **If it's a SaaS API:** Use **Nuxt SSR** (don't load any external data in the browser) or **a custom API middleware**.
- **For best performance:** Avoid CORS entirely by using **server-side proxying**.


## 🔹 Best Practice Summary
| Solution | CORS-Free? | Performance | Setup Effort | When to Use? |
|----------|------------|-------------|--------------|--------------|
| **Reverse Proxy (NGINX)** | ✅ Yes | 🚀 Fast | 🔧 Medium | Self-hosted, best performance |
| **Nuxt SSR Mode** | ✅ Yes | ⚡ Fast | 🛠 Easy | Works for APIs without CORS settings |
| **Modify Shopware API CORS** | ❌ No | 🚀 Fast | 🛠 Easy | When you control the API |
| **Custom API Middleware** | ✅ Yes | 🐢 Slower | 🛠 Hard | When API CORS cannot be changed |

