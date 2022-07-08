import { CmsBlock, CmsSlot } from "@shopware-pwa/commons";

type BlockType<SLOT_NAMES> = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: SLOT_NAMES;
    }
  >;
};

type THREE_COLUMNS = "left" | "center" | "right";
type TWO_COLUMNS = "left" | "right";

export type CmsBlockText = BlockType<"content">;
export type CmsBlockTextHero = BlockType<"content">;
export type CmsBlockTextTeaser = BlockType<"content">;
export type CmsBlockTextTeaserSection = BlockType<TWO_COLUMNS>;
export type CmsBlockTextTwoColumn = BlockType<TWO_COLUMNS>;
export type CmsBlockTextThreeColumn = BlockType<THREE_COLUMNS>;

export type CmsBlockImage = BlockType<"image">;
export type CmsBlockImageCover = BlockType<"image">;
export type CmsBlockImageTwoColumn = BlockType<TWO_COLUMNS>;
export type CmsBlockImageThreeColumn = BlockType<THREE_COLUMNS>;
export type CmsBlockImageThreeCover = BlockType<THREE_COLUMNS>;
export type CmsBlockImageFourColumn = BlockType<
  "left" | "center-left" | "center-right" | "right"
>;
export type CmsBlockImageBubbleRow = BlockType<THREE_COLUMNS>;
export type CmsBlockImageHighlightRow = BlockType<THREE_COLUMNS>;
export type CmsBlockImageSimpleGrid = BlockType<
  "left-top" | "left-bottom" | "right"
>;
export type CmsBlockImageSlider = BlockType<"imageSlider">;
export type CmsBlockImageGallery = BlockType<"imageGallery">;

export type CmsBlockYoutubeVideo = BlockType<"video">;
export type CmsBlockVimeoVideo = BlockType<"video">;

export type CmsBlockImageText = BlockType<TWO_COLUMNS>;
export type CmsBlockImageTextCover = BlockType<TWO_COLUMNS>;
export type CmsBlockCenterText = BlockType<THREE_COLUMNS>;
export type CmsBlockImageTextRow = BlockType<
  | "left-image"
  | "left-text"
  | "center-image"
  | "center-text"
  | "right-image"
  | "right-text"
>;
export type CmsBlockImageTextGallery = BlockType<
  | "left-image"
  | "left-text"
  | "center-image"
  | "center-text"
  | "right-image"
  | "right-text"
>;
export type CmsBlockImageTextBubble = BlockType<
  | "left-image"
  | "left-text"
  | "center-image"
  | "center-text"
  | "right-image"
  | "right-text"
>;
export type CmsBlockTextOnImage = BlockType<"content">;

export type CmsBlockSidebarFilter = BlockType<"content">;
export type CmsBlockCategoryNavigation = BlockType<"content">;

export type CmsBlockProductHeading = BlockType<TWO_COLUMNS>;
export type CmsBlockProductThreeColumn = BlockType<THREE_COLUMNS>;
export type CmsBlockProductListing = BlockType<"content">;
export type CmsBlockProductSlider = BlockType<"productSlider">;
export type CmsBlockGalleryBuybox = BlockType<TWO_COLUMNS>;
export type CmsBlockProductDescriptionReviews = BlockType<"content">;
export type CmsBlockCrossSelling = BlockType<"content">;

export type CmsBlockForm = BlockType<"content">;
