Display the category name as the page headline, in the `category-heading` block. Since Shopware 6.7.12 the default listing layouts use it in place of a text element.

The element is a text element with its own type:

- **Mapped content** (by default `category.name`) is wrapped in `<h1 class="cms-element-category-name-headline">`, as in the Storefront. When the value does not resolve, for example on a page without a category, no empty headline is rendered.
- **Static content** is authored HTML and is rendered as it is.

Rendering goes through `CmsElementText`, so the vertical alignment, link handling and the [`cms-element-text` typography](#cmselementtext) apply. The root carries the `cms-element-category-name` class as well.
