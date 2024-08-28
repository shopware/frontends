import type { Schemas } from "#shopware";
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
export type CmsElementText = Schemas["CmsSlot"] & {
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
  horizontalAlign: ElementConfig<VerticalAlign>;
};

export type CmsElementImage = Schemas["CmsSlot"] & {
  type: "image";
  config: ImageElementConfig;
  data: {
    mediaId: string;
    url: string;
    newTab: boolean;
    apiAlias: "cms_image";
    media: Schemas["Media"];
  };
};

// Image Slider
export type SliderElementConfig = {
  minWidth?: ElementConfig<string>;
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

export type CmsElementImageSlider = Schemas["CmsSlot"] & {
  type: "image-slider";
  config: ImageSliderElementConfig;
  data: {
    apiAlias: "cms_image_slider";
    navigation: unknown;
    sliderItems: {
      url: string;
      newTab: boolean;
      media: Schemas["Media"];
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

export type CmsElementImageGallery = Schemas["CmsSlot"] & {
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
          media: Schemas["Media"];
          apiAlias: "cms_image_slider_item";
        }
      | Schemas["ProductMedia"]
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
export type CmsElementYoutubeVideo = Schemas["CmsSlot"] & {
  type: "youtube-video";
  config: YouTubeVideoElementConfig;
  data: {
    mediaId: string | null;
    url: null | string;
    newTab: null | boolean;
    media: null | Schemas["Media"];
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

export type CmsElementVimeoVideo = Schemas["CmsSlot"] & {
  type: "vimeo-video";
  config: VimeoVideoElementConfig;
  data: {
    mediaId: string | null; // actually a CmsElementImage data, consider unify this
    url: null | string;
    newTab: null | boolean;
    media: null | Schemas["Media"];
    apiAlias: "cms_image";
  };
};

// Product Box

type ProductBoxElementConfig = {
  boxLayout: ElementConfig<BoxLayout>;
  product: ElementConfig<string>;
};

export type CmsElementProductBox = Schemas["CmsSlot"] & {
  type: "product-box";
  config: ProductBoxElementConfig;
  data: {
    productId: string;
    product: Schemas["Product"];
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

export type CmsElementProductSlider = Schemas["CmsSlot"] & {
  type: "product-slider";
  config: ProductSliderElementConfig;
  data: {
    apiAlias: "cms_product_slider";
    products: Schemas["Product"][];
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

export type CmsElementSidebarFilter = Schemas["CmsSlot"] & {
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

export type CmsElementProductListing = Schemas["CmsSlot"] & {
  type: "product-listing";
  config: CmsProductListingElementConfig;
  data: {
    apiAlias: "cms_product_listing";
    listing: Schemas["ProductListingResult"];
  };
};

// Category Navigation

type CategoryNavigationElementConfig = unknown;

export type CmsElementCategoryNavigation = Schemas["CmsSlot"] & {
  type: "category-navigation";
  config: CategoryNavigationElementConfig;
};

type ProductDescriptionReviewsElementConfig = {
  product: ElementConfig<string>;
  alignment: ElementConfig<VerticalAlign>;
};

export type CmsElementProductDescriptionReviews = Schemas["CmsSlot"] & {
  type: "product-description-reviews";
  config: ProductDescriptionReviewsElementConfig;
  data: {
    productId: null | string;
    ratingSuccess: boolean;
    product?: Schemas["Product"];
    reviews: {
      elements: Schemas["ProductReview"][];
    };
    apiAlias: "cms_product_description_reviews";
  };
};

// Buy Box

type BuyBoxElementConfig = ProductDescriptionReviewsElementConfig;
// buy box has the same interface in data as product description reviews! unify later
export type CmsElementBuyBox = Schemas["CmsSlot"] & {
  type: "buy-box";
  config: BuyBoxElementConfig;
  data: {
    configuratorSettings: Schemas["PropertyGroup"][] | null;
    productId: null | string;
    ratingSuccess: boolean;
    product?: Schemas["Product"];
    reviews: Schemas["ProductReview"][];
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

export type CmsElementCrossSelling = Schemas["CmsSlot"] & {
  type: "cross-selling";
  config: CrossSellingElementConfig;
  data: {
    apiAlias: "cms_cross_selling";
    crossSellings: Schemas["CrossSellingElement"][];
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

export type CmsElementForm = Schemas["CmsSlot"] & {
  type: "form";
  config: FormElementConfig;
  data: Schemas["Salutation"][];
};

// Product Name
export type CmsElementProductName = Schemas["CmsSlot"] & {
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
export type CmsElementManufacturerLogo = Schemas["CmsSlot"] & {
  type: "manufacturer-logo";
  config: ImageElementConfig;
  data: {
    mediaId: string;
    url: string;
    newTab: boolean;
    apiAlias: "cms_manufacturer_logo";
    media: Schemas["Media"];
  };
};
