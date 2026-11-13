import { CmsBlockCategoryNavigation } from "./components/block/CmsBlockCategoryNavigation";
import { CmsBlockCenterText } from "./components/block/CmsBlockCenterText";
import { CmsBlockCrossSelling } from "./components/block/CmsBlockCrossSelling";
import { CmsBlockCustomForm } from "./components/block/CmsBlockCustomForm";
import { CmsBlockDefault } from "./components/block/CmsBlockDefault";
import { CmsBlockForm } from "./components/block/CmsBlockForm";
import { CmsBlockGalleryBuybox } from "./components/block/CmsBlockGalleryBuybox";
import { CmsBlockHtml } from "./components/block/CmsBlockHtml";
import { CmsBlockImage } from "./components/block/CmsBlockImage";
import { CmsBlockImageBubbleRow } from "./components/block/CmsBlockImageBubbleRow";
import { CmsBlockImageCover } from "./components/block/CmsBlockImageCover";
import { CmsBlockImageFourColumn } from "./components/block/CmsBlockImageFourColumn";
import { CmsBlockImageGallery } from "./components/block/CmsBlockImageGallery";
import { CmsBlockImageGalleryBig } from "./components/block/CmsBlockImageGalleryBig";
import { CmsBlockImageHighlightRow } from "./components/block/CmsBlockImageHighlightRow";
import { CmsBlockImageSimpleGrid } from "./components/block/CmsBlockImageSimpleGrid";
import { CmsBlockImageSlider } from "./components/block/CmsBlockImageSlider";
import { CmsBlockImageText } from "./components/block/CmsBlockImageText";
import { CmsBlockImageTextBubble } from "./components/block/CmsBlockImageTextBubble";
import { CmsBlockImageTextCover } from "./components/block/CmsBlockImageTextCover";
import { CmsBlockImageTextGallery } from "./components/block/CmsBlockImageTextGallery";
import { CmsBlockImageTextRow } from "./components/block/CmsBlockImageTextRow";
import { CmsBlockImageThreeColumn } from "./components/block/CmsBlockImageThreeColumn";
import { CmsBlockImageThreeCover } from "./components/block/CmsBlockImageThreeCover";
import { CmsBlockImageTwoColumn } from "./components/block/CmsBlockImageTwoColumn";
import { CmsBlockProductDescriptionReviews } from "./components/block/CmsBlockProductDescriptionReviews";
import { CmsBlockProductHeading } from "./components/block/CmsBlockProductHeading";
import { CmsBlockProductListing } from "./components/block/CmsBlockProductListing";
import { CmsBlockProductSlider } from "./components/block/CmsBlockProductSlider";
import { CmsBlockProductThreeColumn } from "./components/block/CmsBlockProductThreeColumn";
import { CmsBlockSidebarFilter } from "./components/block/CmsBlockSidebarFilter";
import { CmsBlockSpatialViewer } from "./components/block/CmsBlockSpatialViewer";
import { CmsBlockText } from "./components/block/CmsBlockText";
import { CmsBlockTextHero } from "./components/block/CmsBlockTextHero";
import { CmsBlockTextOnImage } from "./components/block/CmsBlockTextOnImage";
import { CmsBlockTextTeaser } from "./components/block/CmsBlockTextTeaser";
import { CmsBlockTextTeaserSection } from "./components/block/CmsBlockTextTeaserSection";
import { CmsBlockTextThreeColumn } from "./components/block/CmsBlockTextThreeColumn";
import { CmsBlockTextTwoColumn } from "./components/block/CmsBlockTextTwoColumn";
import { CmsBlockVimeoVideo } from "./components/block/CmsBlockVimeoVideo";
import { CmsBlockYoutubeVideo } from "./components/block/CmsBlockYoutubeVideo";
import { CmsElementBuyBox } from "./components/element/CmsElementBuyBox";
import { CmsElementCategoryNavigation } from "./components/element/CmsElementCategoryNavigation";
import { CmsElementCrossSelling } from "./components/element/CmsElementCrossSelling";
import { CmsElementCustomForm } from "./components/element/CmsElementCustomForm";
import { CmsElementForm } from "./components/element/CmsElementForm";
import { CmsElementHtml } from "./components/element/CmsElementHtml";
import { CmsElementImage } from "./components/element/CmsElementImage";
import { CmsElementImageGallery } from "./components/element/CmsElementImageGallery";
import { CmsElementImageSlider } from "./components/element/CmsElementImageSlider";
import { CmsElementManufacturerLogo } from "./components/element/CmsElementManufacturerLogo";
import { CmsElementProductBox } from "./components/element/CmsElementProductBox";
import { CmsElementProductDescriptionReviews } from "./components/element/CmsElementProductDescriptionReviews";
import { CmsElementProductListing } from "./components/element/CmsElementProductListing";
import { CmsElementProductName } from "./components/element/CmsElementProductName";
import { CmsElementProductSlider } from "./components/element/CmsElementProductSlider";
import { CmsElementSidebarFilter } from "./components/element/CmsElementSidebarFilter";
import { CmsElementText } from "./components/element/CmsElementText";
import { CmsElementVimeoVideo } from "./components/element/CmsElementVimeoVideo";
import { CmsElementYoutubeVideo } from "./components/element/CmsElementYoutubeVideo";
import { CmsSectionDefault } from "./components/section/CmsSectionDefault";
import { CmsSectionSidebar } from "./components/section/CmsSectionSidebar";
import { createCmsRegistry } from "./registry";

export const defaultCmsRegistry = createCmsRegistry({
  sections: {
    default: CmsSectionDefault,
    sidebar: CmsSectionSidebar,
  },
  blocks: {
    "category-navigation": CmsBlockCategoryNavigation,
    "center-text": CmsBlockCenterText,
    "cross-selling": CmsBlockCrossSelling,
    "custom-form": CmsBlockCustomForm,
    default: CmsBlockDefault,
    form: CmsBlockForm,
    "gallery-buybox": CmsBlockGalleryBuybox,
    html: CmsBlockHtml,
    image: CmsBlockImage,
    "image-bubble-row": CmsBlockImageBubbleRow,
    "image-cover": CmsBlockImageCover,
    "image-four-column": CmsBlockImageFourColumn,
    "image-gallery": CmsBlockImageGallery,
    "image-gallery-big": CmsBlockImageGalleryBig,
    "image-highlight-row": CmsBlockImageHighlightRow,
    "image-simple-grid": CmsBlockImageSimpleGrid,
    "image-slider": CmsBlockImageSlider,
    "image-text": CmsBlockImageText,
    "image-text-bubble": CmsBlockImageTextBubble,
    "image-text-cover": CmsBlockImageTextCover,
    "image-text-gallery": CmsBlockImageTextGallery,
    "image-text-row": CmsBlockImageTextRow,
    "image-three-column": CmsBlockImageThreeColumn,
    "image-three-cover": CmsBlockImageThreeCover,
    "image-two-column": CmsBlockImageTwoColumn,
    "product-description-reviews": CmsBlockProductDescriptionReviews,
    "product-heading": CmsBlockProductHeading,
    "product-listing": CmsBlockProductListing,
    "product-slider": CmsBlockProductSlider,
    "product-three-column": CmsBlockProductThreeColumn,
    "sidebar-filter": CmsBlockSidebarFilter,
    "spatial-viewer": CmsBlockSpatialViewer,
    text: CmsBlockText,
    "text-hero": CmsBlockTextHero,
    "text-on-image": CmsBlockTextOnImage,
    "text-teaser": CmsBlockTextTeaser,
    "text-teaser-section": CmsBlockTextTeaserSection,
    "text-three-column": CmsBlockTextThreeColumn,
    "text-two-column": CmsBlockTextTwoColumn,
    "vimeo-video": CmsBlockVimeoVideo,
    "youtube-video": CmsBlockYoutubeVideo,
  },
  elements: {
    "buy-box": CmsElementBuyBox,
    "category-navigation": CmsElementCategoryNavigation,
    "cross-selling": CmsElementCrossSelling,
    "custom-form": CmsElementCustomForm,
    form: CmsElementForm,
    html: CmsElementHtml,
    image: CmsElementImage,
    "image-gallery": CmsElementImageGallery,
    "image-slider": CmsElementImageSlider,
    "manufacturer-logo": CmsElementManufacturerLogo,
    "product-box": CmsElementProductBox,
    "product-description-reviews": CmsElementProductDescriptionReviews,
    "product-listing": CmsElementProductListing,
    "product-name": CmsElementProductName,
    "product-slider": CmsElementProductSlider,
    "sidebar-filter": CmsElementSidebarFilter,
    text: CmsElementText,
    "vimeo-video": CmsElementVimeoVideo,
    "youtube-video": CmsElementYoutubeVideo,
  },
});
