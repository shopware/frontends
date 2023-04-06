---
head:
  - - meta
    - name: og:title
      content: Community Modules
  - - meta
    - name: og:description
      content: "The following section contains modules, plugins and other resources that are created and maintaned by the community."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Community%20**Modules**.png?fontSize=150px"
nav:
  position: 10
  title: Setup templates
---

<script setup>
import CommunityModule from '../../components/CommunityModule.vue'

const communityModules = [
    {
        title: 'Middleware Proxy Module',
        maintainer: 'meeshoogendoorn',
        link: 'https://github.com/meeshoogendoorn/shopware-frontends-proxy',
        description: 'Nuxt middleware proxy for Shopware Frontends. Remove the need for CORS preflight requests',
        icon: '🚀'
    },
    {
        title: 'Nuxt Cache Tags',
        maintainer: 'niklaswolf',
        link: 'https://github.com/mothership-gmbh/nuxt-shopware-caching',
        description: 'Nuxt-Module, that provides a system to set shopware cache-tags for later use in e.g. a full-page cache.',
        icon: '⚡️'
    },
    {
        title: 'Headless CMS POC',
        maintainer: 'meeshoogendoorn',
        link: 'https://github.com/meeshoogendoorn/shopware-frontends-headless-cms-integration',
        description: 'Prototype for a headless CMS integration for Shopware Frontends with Storyblok',
        icon: '📝'
    }
]
</script>

# Community Modules

:::warning
The modules listed here are not officially supported or maintained by Shopware. Please use them at your own risk.
:::

The following section contains modules, plugins and other resources that are created and maintaned by the community. If you want to contribute to this list, please create a [pull request](https://github.com/shopware/frontends/pulls) or submit a new [idea](https://github.com/shopware/frontends/discussions/categories/ideas).

<div class="grid md:grid-cols-2 2xl:grid-cols-3 gap-3">
    <CommunityModule
        v-for="item in communityModules"
        :key="item.title"
        :title="item.title"
        :maintainer="item.maintainer"
        :link="item.link"
        :description="item.description"
        :icon="item.icon"
    />
    <CommunityModule
        title="Your module?"
        maintainer="you"
        description="Got an idea or a module? Share it with the community!"
        icon="🤔"
    />
</div>
