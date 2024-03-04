/**
 * Sidebar configuration is exported so DevHub can import it and prefix links with /frontends/.
 */
export const sidebar = [
    {
        text: "SHOPWARE FRONTENDS",
        items: [
            { text: "Overview", link: "/" },
            { text: "Why Shopware Frontends", link: "/why-shopware-frontends" },
        ],
    },
    {
        text: "FRAMEWORK",
        link: "/framework/",
        items: [
            { text: "Requirements", link: "/framework/requirements" },
            { text: "Internal Structure", link: "/framework/internal-structure" },
            {
                text: "Composables",
                link: "/framework/composables",
                items: [
                    {
                        text: "Context Composables",
                        link: "/framework/composables/context-composables",
                    },
                    {
                        text: "Shared Composables",
                        link: "/framework/composables/shared-composables",
                    },
                    {
                        text: "Overwriting Composables",
                        link: "/framework/composables/overwriting-composables",
                    },
                ],
            },
            { text: "Shopping Experiences", link: "/framework/shopping-experiences" },
            { text: "Styling", link: "/framework/styling" },
        ],
    },
    {
        text: "BUILDING",
        link: "/getting-started/",
        items: [
            {
                text: "Setup Templates",
                link: "/getting-started/templates",
                items: [
                    {
                        text: "Demo Store",
                        link: "/getting-started/templates/demo-store-template",
                    },
                    {
                        text: "Blank Template",
                        link: "/getting-started/templates/blank-template",
                    },
                    {
                        text: "Custom Vue Project",
                        link: "/getting-started/templates/custom-vue-project",
                    },
                    {
                        text: "Custom React Project",
                        link: "/getting-started/templates/custom-react-project",
                    },
                    {
                        text: "Astro Template",
                        link: "/getting-started/templates/astro-template",
                    },
                ],
            },
            { text: "Routing", link: "/getting-started/routing" },
            { text: "Languages", link: "/getting-started/languages" },
            {
                text: "CMS",
                link: "/getting-started/cms/",
                items: [
                    { text: "Content Pages", link: "/getting-started/cms/content-pages" },
                    {
                        text: "Customize Components",
                        link: "/getting-started/cms/customize-components",
                    },
                    { text: "Create Blocks", link: "/getting-started/cms/create-blocks" },
                    {
                        text: "Create Elements",
                        link: "/getting-started/cms/create-elements",
                    },
                    {
                        text: "Overwriting CMS",
                        link: "/getting-started/cms/overwriting-cms",
                    },
                ],
            },
            {
                text: "E-Commerce",
                link: "/getting-started/e-commerce/",
                items: [
                    {
                        text: "Product listing",
                        link: "/getting-started/e-commerce/product-listing",
                    },
                    {
                        text: "Product detail page",
                        link: "/getting-started/e-commerce/product-detail-page",
                    },
                    { text: "Prices", link: "/getting-started/e-commerce/prices" },
                    { text: "Cart", link: "/getting-started/e-commerce/cart" },
                    { text: "Checkout", link: "/getting-started/e-commerce/checkout" },
                    { text: "Payments", link: "/getting-started/e-commerce/payments" },
                    {
                        text: "Custome Payment",
                        link: "/getting-started/e-commerce/custom-payment",
                    },
                    {
                        text: "JSON-LD",
                        link: "/getting-started/e-commerce/json-ld",
                    },
                ],
            },
            {
                text: "Features",
                link: "/getting-started/features/",
                items: [
                    {
                        text: "Sitemap",
                        link: "/getting-started/features/sitemap",
                    },
                    {
                        text: "Wishlist",
                        link: "/getting-started/features/wishlist",
                    },
                    {
                        text: "Custom Products extension",
                        link: "/getting-started/features/custom-products",
                    },
                ],
            },
            {
                text: "Page elements",
                link: "/getting-started/page-elements/",
                items: [
                    {
                        text: "Breadcrumbs",
                        link: "/getting-started/page-elements/breadcrumbs",
                    },
                    { text: "Images", link: "/getting-started/page-elements/images" },
                    {
                        text: "Login Form",
                        link: "/getting-started/page-elements/login-form",
                    },
                    {
                        text: "Navigation",
                        link: "/getting-started/page-elements/navigation",
                    },
                    {
                        text: "Examples",
                        link: "/getting-started/page-elements/examples/",
                        items: [
                            {
                                text: "Cart",
                                link: "/getting-started/page-elements/examples/cart/",
                            },
                            {
                                text: "Product listing",
                                link: "/getting-started/page-elements/examples/listing/",
                            },
                            {
                                text: "Product Detail Page",
                                link: "/getting-started/page-elements/examples/product-detail-page/",
                            },
                            {
                                text: "Footer Navigation",
                                link: "/getting-started/page-elements/examples/footer-navigation/",
                            },
                            {
                                text: "Navigation",
                                link: "/getting-started/page-elements/examples/navigation/",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        text: "BEST PRACTICES",
        link: "/best-practices/",
        items: [
            { text: "Deployment", link: "/best-practices/deployment" },
            {
                text: "Error Handling",
                link: "/best-practices/error-handling",
                items: [
                    {
                        text: "API Client Error Handling",
                        link: "/best-practices/error-handling/api-client-error-handling",
                    },
                ],
            },
            { text: "Images", link: "/best-practices/images" },
            { text: "Performance", link: "/best-practices/performance" },
            { text: "Testing", link: "/best-practices/testing" },
        ],
    },
    {
        text: "RESOURCES",
        link: "/resources/",
        items: [
            { text: "🚀 Links", link: "/resources/links" },
            { text: "🤗 Community Modules", link: "/resources/community-modules/" },
            { text: "😱 Troubleshooting", link: "/resources/troubleshooting" },
            {
                text: "Integrations",
                link: "/resources/integrations/",
                items: [
                    {
                        text: "Multi CMS instance",
                        link: "/resources/integrations/multi-cms",
                    },
                    { text: "Strapi", link: "/resources/integrations/strapi/" },
                ],
            },
        ],
    },
    {
        text: "PACKAGE REFERENCE",
        link: "/packages/",
        items: [
            { text: "Composables", link: "/packages/composables" },
            {
                text: "API Client",
                link: "/packages/api-client",
                items: [
                    {
                        text: "Associations",
                        link: "/packages/api-client/docs/associations",
                    },
                    {
                        text: "Storefront URL",
                        link: "/packages/api-client/docs/storefront-url",
                    },
                ],
            },
            { text: "Types", link: "/packages/types" },
            { text: "Helpers", link: "/packages/helpers" },
        ],
    },
];