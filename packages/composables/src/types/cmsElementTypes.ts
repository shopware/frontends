import type { Schemas } from "#shopware";
import type {
  CmsSlot,
  CrossSelling,
  EntityResult,
  Media,
  Product,
  ProductListingResult,
  ProductMedia,
  ProductReview,
  Salutation,
} from "@shopware-pwa/types";
import type { CSSProperties } from "vue";

export type SourceType = "static" | "mapped";

export type Position = "left" | "center" | "right";

export type DisplayMode =
  | Exclude<CSSProperties["objectFit"], undefined>
  | "standard";

export type BoxLayout = "standard" | "image" | "minimal";

export type VerticalAlign = "flex-start" | "center" | "flex-end" | "";

export type ElementConfig<VALUE_TYPE> = {
  source: SourceType;
  value: VALUE_TYPE;
};

type TextElementConfig = {
  content: ElementConfig<string>;
  verticalAlign: ElementConfig<VerticalAlign>;
};

type ElementFieldConfig = {
  name: string;
  source: SourceType;
  value: string | null;
  apiAlias: string;
};

// Text
export type CmsElementText = CmsSlot & {
  type: "text" | typeof String;
  slot: typeof String;
  config: TextElementConfig;
  fieldConfig: ElementFieldConfig[];
  data: {
    content: string;
    apiAlias: "cms_text";
  };
  translated: {
    config: TextElementConfig;
  };
};

// Image

type ImageElementConfig = {
  url: ElementConfig<string>;
  media: ElementConfig<string>;
  newTab: ElementConfig<boolean>;
  product: ElementConfig<string>;
  boxLayout: ElementConfig<BoxLayout>;
  displayMode: ElementConfig<DisplayMode>;
  minHeight: ElementConfig<string | number>;
  verticalAlign: ElementConfig<VerticalAlign>;
};

export type CmsElementImage = CmsSlot & {
  type: "image";
  config: ImageElementConfig;
  data: {
    mediaId: string;
    url: string;
    newTab: boolean;
    apiAlias: "cms_image";
    media: Media;
  };
};

// Image Slider
export type SliderElementConfig = {
  minHeight: ElementConfig<string | number>;
  verticalAlign?: ElementConfig<VerticalAlign>;
  displayMode?: ElementConfig<"standard" | "cover" | "contain">;
  navigationDots?: ElementConfig<"outside" | "inside" | "">;
  navigationArrows?: ElementConfig<"outside" | "inside" | "">;
};

type ImageSliderElementConfig = ImageElementConfig &
  SliderElementConfig & {
    sliderItems: ElementConfig<
      Array<{
        url: null | string;
        newTab: boolean;
        mediaId: string;
        mediaUrl: string;
      }>
    >;
  };

export type CmsElementImageSlider = CmsSlot & {
  type: "image-slider";
  config: ImageSliderElementConfig;
  data: {
    apiAlias: "cms_image_slider";
    navigation: unknown;
    sliderItems: {
      url: string;
      newTab: boolean;
      media: Media;
      mediaId: string;
      apiAlias: "cms_image_slider_item";
    }[];
  };
};

// Image Gallery

type ImageGalleryElementConfig = ImageSliderElementConfig & {
  galleryPosition: ElementConfig<Position>;
  magnifierOverGallery: ElementConfig<boolean>;
  keepAspectRatioOnZoom: ElementConfig<boolean>;
  fullScreen: ElementConfig<boolean>;
  zoom: ElementConfig<boolean>;
};

export type CmsElementImageGallery = CmsSlot & {
  type: "image-gallery";
  config: ImageGalleryElementConfig;
  data: {
    // actually a CmsElementImageSlider data, consider unify this
    apiAlias: "cms_image_slider";
    navigation: unknown;
    sliderItems: Array<
      | {
          url: null | string;
          newTab: boolean;
          media: Media;
          apiAlias: "cms_image_slider_item";
        }
      | ProductMedia
    >;
  };
};

// YouTube video
type YouTubeVideoElementConfig = {
  end: ElementConfig<string>;
  url: ElementConfig<string>;
  loop: ElementConfig<boolean>;
  start: ElementConfig<string>;
  videoID: ElementConfig<string>;
  autoPlay: ElementConfig<boolean>;
  displayMode: ElementConfig<DisplayMode>;
  previewMedia: ElementConfig<string>;
  showControls: ElementConfig<boolean>;
  needsConfirmation: ElementConfig<boolean>;
  advancePrivacyMode: ElementConfig<boolean>;
};
export type CmsElementYoutubeVideo = CmsSlot & {
  type: "youtube-video";
  config: YouTubeVideoElementConfig;
  data: {
    mediaId: string | null;
    url: null | string;
    newTab: null | boolean;
    media: null | Media;
    apiAlias: "cms_image";
  };
};

// Vimeo video
type VimeoVideoElementConfig = {
  loop: ElementConfig<boolean>;
  color: ElementConfig<string>;
  title: ElementConfig<boolean>;
  mute: ElementConfig<boolean>;
  byLine: ElementConfig<boolean>;
  videoID: ElementConfig<string>;
  autoplay: ElementConfig<boolean>;
  controls: ElementConfig<boolean>;
  portrait: ElementConfig<boolean>;
  doNotTrack: ElementConfig<boolean>;
  previewMedia: ElementConfig<string>;
  needsConfirmation: ElementConfig<boolean>;
};

export type CmsElementVimeoVideo = CmsSlot & {
  type: "vimeo-video";
  config: VimeoVideoElementConfig;
  data: {
    mediaId: string | null; // actually a CmsElementImage data, consider unify this
    url: null | string;
    newTab: null | boolean;
    media: null | Media;
    apiAlias: "cms_image";
  };
};

// Product Box

type ProductBoxElementConfig = {
  boxLayout: ElementConfig<BoxLayout>;
  product: ElementConfig<string>;
};

export type CmsElementProductBox = CmsSlot & {
  type: "product-box";
  config: ProductBoxElementConfig;
  data: {
    productId: string;
    product: Product;
    apiAlias: "cms_product_box";
  };
};

// Product Slider

type ProductSliderElementConfig = {
  title: ElementConfig<string>;
  border: ElementConfig<boolean>;
  rotate: ElementConfig<boolean>;
  products: ElementConfig<string[]>;
  boxLayout: ElementConfig<BoxLayout>;
  elMinWidth: ElementConfig<string>;
  navigation: ElementConfig<boolean>;
  displayMode: ElementConfig<DisplayMode>;
  verticalAlign: ElementConfig<VerticalAlign>;
  productStream: ElementConfig<string>;
  productStreamSorting: ElementConfig<string>;
};

export type CmsElementProductSlider = CmsSlot & {
  type: "product-slider";
  config: ProductSliderElementConfig;
  data: {
    apiAlias: "cms_product_slider";
    products: Product[];
  };
};

// Sidebar Filter (Sidebar filter)

type CmsSidebarFilterElementConfig = {
  boxLayout: ElementConfig<BoxLayout>;
  content: ElementConfig<string>;
  displayMode: ElementConfig<DisplayMode>;
  media: ElementConfig<string>;
  minHeight: ElementConfig<string | number>;
  newTab: ElementConfig<boolean>;
  url: ElementConfig<string>;
  verticalAlign: ElementConfig<VerticalAlign>;
};

export type CmsElementSidebarFilter = CmsSlot & {
  type: "sidebar-filter";
  config: CmsSidebarFilterElementConfig;
};

// Product Listing

type CmsProductListingElementConfig = {
  filters: ElementConfig<string>;
  boxLayout: ElementConfig<BoxLayout>;
  showSorting: ElementConfig<boolean>;
  defaultSorting: ElementConfig<string>;
  useCustomSorting: ElementConfig<boolean>;
  availableSortings: ElementConfig<string[]>;
  propertyWhitelist: ElementConfig<string[]>;
};

export type CmsElementProductListing = CmsSlot & {
  type: "product-listing";
  config: CmsProductListingElementConfig;
  data: {
    apiAlias: "cms_product_listing";
    listing: ProductListingResult;
  };
};

// Category Navigation

type CategoryNavigationElementConfig = unknown;

export type CmsElementCategoryNavigation = CmsSlot & {
  type: "category-navigation";
  config: CategoryNavigationElementConfig;
};

type ProductDescriptionReviewsElementConfig = {
  product: ElementConfig<string>;
  alignment: ElementConfig<VerticalAlign>;
};

export type CmsElementProductDescriptionReviews = CmsSlot & {
  type: "product-description-reviews";
  config: ProductDescriptionReviewsElementConfig;
  data: {
    productId: null | string;
    ratingSuccess: boolean;
    product?: Product;
    reviews: EntityResult<"product_review", ProductReview>;
    apiAlias: "cms_product_description_reviews";
  };
};

// Buy Box

type BuyBoxElementConfig = ProductDescriptionReviewsElementConfig;
// buy box has the same interface in data as product description reviews! unify later
export type CmsElementBuyBox = CmsSlot & {
  type: "buy-box";
  config: BuyBoxElementConfig;
  data: {
    configuratorSettings: Schemas["PropertyGroup"][] | null;
    productId: null | string;
    ratingSuccess: boolean;
    product?: Product;
    reviews: EntityResult<"product_review", ProductReview>;
    apiAlias: "cms_product_description_reviews";
  };
};

// Cross Selling

type CrossSellingElementConfig = {
  product: ElementConfig<string>;
  alignment: ElementConfig<VerticalAlign>;
  boxLayout: ElementConfig<BoxLayout>;
  elMinWidth: ElementConfig<string>;
  displayMode: ElementConfig<DisplayMode>;
};

export type CmsElementCrossSelling = CmsSlot & {
  type: "cross-selling";
  config: CrossSellingElementConfig;
  data: {
    apiAlias: "cms_cross_selling";
    crossSellings: CrossSelling;
  };
};

// Form (newsletter and contact form types)

type FormElementConfig = {
  type: ElementConfig<"contact" | "newsletter">;
  title: ElementConfig<string>;
  mailReceiver: ElementConfig<string[]>;
  confirmationText: ElementConfig<string>;
  defaultMailReceiver: ElementConfig<boolean>;
};

export type CmsElementForm = CmsSlot & {
  type: "form";
  config: FormElementConfig;
  data: Salutation[];
};

// Product Name
export type CmsElementProductName = CmsSlot & {
  type: "product-name";
  config: TextElementConfig;
  fieldConfig: ElementFieldConfig[];
  data: {
    content: string;
    apiAlias: "cms_text";
  };
  translated: {
    config: TextElementConfig;
  };
};

// Manufacturer Logo
export type CmsElementManufacturerLogo = CmsSlot & {
  type: "manufacturer-logo";
  config: ImageElementConfig;
  data: {
    mediaId: string;
    url: string;
    newTab: boolean;
    apiAlias: "cms_manufacturer_logo";
    media: Media;
  };
};
