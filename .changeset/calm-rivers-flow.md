---
"@shopware/cms-base-layer": patch
---

- Fix CMS block layout: height propagation in CmsBlockImageText, conditional `h-full` in CmsElementImage, `backgroundSize` forwarding in CmsGenericBlock, `w-full` for full_width sizing mode, and exclude `sizingMode` from section inline styles
- Fix vertical alignment support in CmsElementText and CmsElementProductSlider using `align-content` CSS property
- Fallback to `media.url` in SwProductCardImage when no thumbnails are available
- Remove rounded corners from image placeholder SVG and simplify CmsBlockTextOnImage structure
