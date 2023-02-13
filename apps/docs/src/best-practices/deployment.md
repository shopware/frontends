---
head:
  - - meta
    - name: og:title
      content: "Best practices: Deployment"
  - - meta
    - name: og:description
      content: "Collection of good practices to help you provide a reliable application."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Deployment**.png?fontSize=110px"
nav:
  position: 30
---

# Deployment

Shopware Frontends can be deployed in multiple ways, depending on the setup you are using. Most likely you will be using either a static hosting service or a server with a Node.js runtime. The different options and approaches are described below.

## Static hosting

This option is the easiest to set up and will work best for small or static projects. With a static hosting, your site will be built once during the deployment and afterwards delivered as static HTML pages with Javascript for dynamic elements.

The biggest advantage is that there is no additional server needed to do the rendering of your page and it scales very well\*, because your entire site is made of files on a server.

### Single page application (SPA)

In a single page application the server sends the application as static HTML and Javascript. After receiving the data, the browser will parse the Javascript and the page becomes interactive. It requires an API at runtime to fetch data like products, categories or a navigation.

Drawbacks of this approach are that it is heavy on the API and that initial page loads take the longest, because the browser has to parse the Javascript before anything can be displayed to the user. That delay has a negative impact on UX and search engine scoring.

### Server-side generation (SSG)

In server-side generation your site's pages - products pages, category pages, content pages - are generated once at build time. Afterwards the site will be delivered as static HTML and Javascript to the client.

The main advantage of SSG is, that browsing activities are not affected by your API backend, because it's used to display products, categories etc. - in most cases it is the approach giving the most potential for good performance. For dynamic operations like cart, user account or checkout the API will still be called.

\*The main drawback is that any change of products, categories, etc. will invalidate the generated pages and require you to re-generate them, so this approach is not ideal for sites that change often.

### Popular static hosting services

There are various services that provide static hosting, such as

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Amazon S3](https://aws.amazon.com/s3/)
- and many more

Each services has its own way of deploying your applications and you should refer to their documentation for more information.

## Dynamic hosting (SSR)

The dynamic hosting option requires a Node.js server to run your application. For every fresh page request, the application is rendered on the server in a process called SSR (server-side rendering) and then delivered as static HTML and Javascript to the client. Afterwards, the static page will become interactive after the browser parsed all Javascript in a process called hydration and it continues working like a [SPA](#single-page-application-spa).

It is the most dynamic and versatile approach and requires no invalidation and is generally better for SEO, since the page is visible to the user right away. For most eCommerce projects it is the best fit, bringing together the SEO and UX benefits of SSG and the actuality of SPA.

Drawbacks are that it requires API access at runtime for all operations. These calls are made by the Node.js server and introduce an additional round-trip (Node server>API>Node server) before the page can be fully rendered and sent to the client. For that reason, it is generally advised to optimize your network infrastructure with regard to that round trip in order to get the most out of the SSR approach. Obviously

### Popular dynamic hosting services

- [Vercel](https://vercel.com/)
- [Heroku](https://www.heroku.com/)


## Prepare you application

The final goal is always deployment, no less equal than development itself.

There are many good tools available that help you build and deploy your application.

### Nitro

The great example is [Nitro](https://github.com/unjs/nitro), which is used by default by [Nuxt 3](https://nuxt.com/docs/guide/concepts/server-engine) as its server engine, but can be also used broadly in the whole JS ecosystem.

Moreover, besides the frameworks or libraries that you can work with using Nitro, there are many ready-to-use platforms providers (called _presets_) which help you to build & deploy (docs included) your app with almost zero config:

* azure
* cloudflare_pages
* netlify
* stormkit
* vercel

Nitro provides also really great examples for other well known platforms (full static, or those serving SSR) and the list you can find [here](https://nitro.unjs.io/deploy).


## Good Practices

Here are the collected rules that may be followed to avoid most common issues during the deployment.

### Automate the processes

Avoid doing manual work like running tests, building, release. The more work is being done automatically, there is less space for human mistake. Many platforms offer built-in CI/CD servers which help to achieve it for you codebase.

### Use Continuous Integration (CI) tools

Always test your application. Test the build, do the static analyze, and whatever that can detect a potential source of problem in production build.

### Use multiple environments

Test several configurations at the same time, like different nodejs version, or the upcoming release branch with upgraded dependencies. That concerns also the API your application relies on. 

### Prepare a checklist

Be prepared, be organized before every roll-out. Deployment checklist shouldn't be to way complicated, but should describe the flow of the work in order to get the deployment done.

