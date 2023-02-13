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

