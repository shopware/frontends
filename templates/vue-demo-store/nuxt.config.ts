import transformerDirective from "@unocss/transformer-directives";
import { NuxtConfig } from '@nuxt/types';
// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0"
        }
      ],
      link: [
        {
          rel: "preload",
          href: "/assets/fonts/inter-v12-latin.css?&display=swap",
          as: "style",
          onload: "this.onload=null;this.rel='stylesheet'"
        },
      ],
      /*noscript: {
        link: [
          {
            rel: "stylesheet",
            href: "/assets/fonts/inter-v12-latin.css?&display=swap",
          },
        ],
      }*/
    }
  },
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://shopware.nwtsaas.com",
        shopwareAccessToken: "SWSCNHRXAKTEBW12C1NETUPVVW",
      },
      shopwareStoreDomain: process.env.FRONT_DOMAIN
    },
  },
  build: {
    transpile: ['@headlessui/vue']
  },
  alias: {
    /**
     * TODO: Temp fix until new VueUse published:
     * - https://github.com/vueuse/vueuse/pull/2449
     * - https://github.com/vueuse/vueuse/actions/workflows/publish.yml
     */
    useMeta: "~/composables/useMeta",
  },
  routeRules: {
    "/": {
      isr: 60 * 60 * 24,
    },
    "/checkout": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
    "/checkout/**": {
      ssr: false,
    },
    "/login": {
      ssr: false,
    },
    "/register": {
      ssr: false,
    },
    "/reset-password": {
      ssr: false,
    },
    "/wishlist": {
      ssr: false,
    },
    "/account": {
      ssr: false,
    },
    "/account/**": {
      ssr: false,
    },
    "/**": {
      isr: 60 * 60 * 24,
    },
  },
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  modules: [
    "@nuxtjs/partytown",
    '@nuxtjs/i18n',
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware-pwa/nuxt3-module",
    "@shopware-pwa/cms-base",
    "@nuxt/image",
    "nuxt3-meta-pixel",
    "@nuxtjs/robots",
  ],
  plugins: [
    "~/plugins/vue-gtm.client.js",
    "~/plugins/gtm-events"
  ],
  facebook: {
    track: 'PageView',
    pixelId: process.env.PIXEL_ID,
    autoPageView: true,
    disabled: false
  },
  image: {
    domains: [
      'shopware.nwtsaas.com'
    ],
    provider: 'fastly',
    fastly: {
      baseURL: 'https://shopware.nwtsaas.com',
      modifiers: {
        format: 'webp',
        quality: '85',
        effect: 'sharpen:100',
      },
    },
  },
  partytown: {
    forward: ['dataLayer.push'],
  },
  // components: true,
  components: {
    dirs: ["~/components"],
    global: true,
  },
  vueuse: {
    ssrHandlers: true,
  },
  nitro: {
    compressPublicAssets: true,
    publicAssets: [
      {
        baseURL: "assets",
        dir: 'public/assets',
        maxAge: 31536000,
      }
    ]
  },
  unocss: {
    uno: true, // enabled `@unocss/preset-uno`
    icons: {
      collections: {
        custom: {
          logo: `<svg width="108" height="20" viewBox="0 0 108 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.0298386 0H3.44981V16.58H13.3814V19.5349H0.0298386V0Z" fill="currentColor"/>
          <path d="M19.899 0H23.319V11.3817C23.319 12.0383 23.3464 12.7041 23.4011 13.3789C23.474 14.0538 23.6564 14.6648 23.9483 15.212C24.2584 15.741 24.7143 16.1788 25.3163 16.5253C25.9364 16.8719 26.8028 17.0451 27.9154 17.0451C29.0281 17.0451 29.8853 16.8719 30.4873 16.5253C31.1074 16.1788 31.5634 15.741 31.8552 15.212C32.1653 14.6648 32.3477 14.0538 32.4024 13.3789C32.4754 12.7041 32.5119 12.0383 32.5119 11.3817V0H35.9319V12.5034C35.9319 13.762 35.7403 14.8564 35.3573 15.7866C34.9743 16.7168 34.4271 17.5011 33.7157 18.1395C33.0226 18.7597 32.1836 19.2248 31.1986 19.5349C30.2137 19.845 29.1193 20 27.9154 20C26.7116 20 25.6172 19.845 24.6323 19.5349C23.6473 19.2248 22.7992 18.7597 22.0878 18.1395C21.3947 17.5011 20.8566 16.7168 20.4736 15.7866C20.0905 14.8564 19.899 13.762 19.899 12.5034V0Z" fill="currentColor"/>
          <path d="M43.6386 0H47.7152L52.1474 6.89467L56.7712 0H60.6016L54.1447 9.41177L61.0667 19.5349H56.9081L52.038 12.0657L47.0859 19.5349H43.1734L50.0955 9.41177L43.6386 0Z" fill="currentColor"/>
          <path d="M68.5479 0H82.6108V2.95486H71.9679V8.07114H81.8174V10.8618H71.9679V16.58H82.8024V19.5349H68.5479V0Z" fill="currentColor"/>
          <path d="M91.2533 0H99.3518C100.848 0 102.143 0.255358 103.237 0.766074C104.331 1.27679 105.225 1.97902 105.918 2.87278C106.611 3.74829 107.122 4.77884 107.45 5.96443C107.797 7.15002 107.97 8.41769 107.97 9.76744C107.97 11.1172 107.797 12.3849 107.45 13.5705C107.122 14.756 106.611 15.7957 105.918 16.6895C105.225 17.565 104.331 18.2581 103.237 18.7688C102.143 19.2795 100.848 19.5349 99.3518 19.5349H91.2533V0ZM94.6733 16.7442H98.0386C99.3701 16.7442 100.455 16.5709 101.294 16.2244C102.152 15.8596 102.817 15.3671 103.292 14.7469C103.784 14.1085 104.112 13.3698 104.277 12.5308C104.459 11.6735 104.55 10.7524 104.55 9.76744C104.55 8.78249 104.459 7.8705 104.277 7.03146C104.112 6.17419 103.784 5.43548 103.292 4.81532C102.817 4.17693 102.152 3.68445 101.294 3.33789C100.455 2.9731 99.3701 2.7907 98.0386 2.7907H94.6733V16.7442Z" fill="currentColor"/>
          </svg>`,
          facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>'
        }
      }
    }, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,
    preflight: true,
    transformers: [transformerDirective()],
    safelist: ['container', 'underline', 'underline-offset-2', 'hidden', 'md:block', 'block', 'md:hidden', 'sm:container', 'max-w-2xl', 'mx-auto', 'gap-4', 'md:gap-8', 'mt-6', 'mt-10', 'md:mt-10', 'mb-10', 'md:mb-25', 'md:mb-20', 'md:mt-20', 'mb-6', 'md:mb-8', 'mb-11', 'md:mb-24', 'mb-2', 'mb-8', 'mt-8', 'md:mb-4', 'mt-20', 'md:mt-40', 'mb-20', 'md:mb-53', 'pt-10', 'md:pt-20', 'pb-6', 'md:pb-8', 'pb-10', 'md:pb-20', 'md:mt-12', 'my-10', 'md:my-20'],
    theme: {
      extend: {
        width: "width",
        height: "height",
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '2rem',
          lg: '2rem',
          xl: '1rem',
          '2xl': '1rem'
        },
        center: true,
        maxWidth: {
          DEFAULT: 'unset',
          sm: 'unset',
          md: 'unset',
          lg: 'unset',
          xl: '1248px',
          '2xl': '1536px'
        },
      },
      colors: {
        current: 'currentColor',
        brand: {
          primary: "#1F2937",
          light: "#5ebbff",
          dark: "#374151",
        },
        red: {
          900: '#991B1B'
        },
        green: {
          500: '#10B981'
        },
        light: {
          primary: '#F1F2F3'
        },
        dark: {
          primary: '#1D1F22',
          variant: '#43464E'
        },
        text: {
          muted: '#72757E'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      boxShadow: {
        input: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  css: [
    "@unocss/reset/tailwind-compat.css", // needed to reset styles see https://unocss.dev/guide/style-reset (@unocss/reset)
  ],
  router: {
    options: {
      linkExactActiveClass: "text-brand-primary",
    },
  },
  ssr: true,
  i18n: {
    locales: [
      {
        code: 'en-GB',
        file: 'en-GB.json'
      },
      {
        code: 'sv-SE',
        file: 'sv-SE.json'
      },
    ],
    langDir: 'locales',
    skipSettingLocaleOnNavigate: true,
    // lazy: true,
    defaultLocale: 'sv-SE'
  },
});
