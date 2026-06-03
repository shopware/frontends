# Documentation guide

_Just some thoughts and guides about how the documentation should work._

## Checklist

- Check to which section your content belongs to (see sections list below)
- Check if there is already a page that has the same topic
- When you add smth to the sidebar make sure it is in same section and needed
- Make sure every entry in the sidebar has an link (without next/prev nav breaks)
- To not messup the sidebar try to work with sub-pages
- In your content use headlines, info blocks and stackblitz
- Make sure your content follows the same structure that other similar pages
- Test every link on your new page or when you move pages

## Documentation sections

- **Framework**
  _Documentation about internals and packages_
  - **Composables**
- **Building** (getting-started)
  _Guides about how to build something (business use-case)_
  _Should be a connection between framework and examples_
  - **CMS**
    _Sub-pages about CMS blocks, elements and pages._
  - **E-Commerce**
    _Sub-pages about E-Commerce related components like prices and so on._
  - **Page-Elements**
    _Sub-pages about Page-Elements that are not related to CMS and E-Commerce._
  - **Templates**
    _Sub-pages about how to setup the different templates we currently have._
- **Best Practices**
  _Sub-pages can be related to frontends but sometimes are also more general or eco-system related._
- **Package Reference**
  _Only references about the packages we have (mostly no guides)._
- **Resources**
  - **Examples**
    _Just for copy and past examples strictly no guides here._
  - **Community Modules**
    _List of know community Modules for Fronteds._

## Workflow

*This repository is embedded into [developer-portal](https://github.com/shopware/developer-portal) under the [/frontends/](https://developer.shopware.com/frontends/). This repository is also connected to the Shopware Dev Docs connector GitHub app which manages commit status checks in PRs and triggers production deployments.

## Development

1. Clone this repository

```bash
cd /www/
git clone git@github.com:shopware/frontends.git
cd frontends
```

2. Make sure you have your local copy of the `developer-portal` repository in the same parent directory.

```bash
pnpm docs:env
```

3. Link articles from your local copy of the `frontends` into the `developer-portal`.

```bash
pnpm docs:link
```

4. Start the development server.

```bash
pnpm docs:preview
```