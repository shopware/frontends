---
"@shopware/cms-base-layer": minor
---

Render the CMS blocks and elements Shopware added since 6.6

Until now these rendered nothing in production and the `CmsNoComponent` placeholder in dev mode:

- **`category-heading` block and `category-name` element** (Shopware 6.7.12). The default listing layouts use them for the category headline since that release, so category pages built on them had lost their headline. Mapped content is wrapped in `<h1 class="cms-element-category-name-headline">` as in the Storefront, static content renders as authored HTML, and the vertical alignment is applied. `CmsElementCategoryName` renders through `CmsElementText`.
- **`video` block and element** (Shopware 6.7.8), for videos from the media library. `CmsElementVideo` supports every option of the element: static or mapped media, the `standard`, `stretch` and `cover` display modes, the minimum height for `cover`, vertical and horizontal alignment, autoplay (always muted), muted, loop, inline playback on iOS, controls, and "Load only after confirmation", which shows the video's cover image from the media module, loads nothing until playback starts and turns autoplay off. Without controls the element is a keyboard-operable play/pause button. The screen reader title names the video and falls back to the media alt text. The button labels and the unsupported-browser text can be translated through `cms.video.playLabel`, `cms.video.pauseLabel` and `cms.video.notSupported`.
- **`app-renderer` block** (Shopware 6.6.1), the type of every block an app registers through the Meteor Admin SDK. `CmsBlockAppRenderer` places the slots in the CSS grid the app declared, in the order the app declared them. A global `CmsBlockAppRenderer{AppBlockName}` component, for example `CmsBlockAppRendererSwagTwoColumns`, renders one app block with its own markup instead, like the Storefront's `block_app_renderer_{name}` Twig block. See "App blocks" in the README.
