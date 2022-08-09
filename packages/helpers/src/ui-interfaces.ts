/**
 * @public
 */
export type UiMediaGalleryItemUrl = {
  url: string;
};

/**
 * @public
 */
export type UiMediaGalleryItem = {
  icon: UiMediaGalleryItemUrl;
  mobile: UiMediaGalleryItemUrl;
  desktop: UiMediaGalleryItemUrl;
};

/**
 * @public
 */
export type UiProductOption = {
  label: string;
  value: string;
  code: string;
  color: string | null;
};

/**
 * @public
 */
export type UiProductProperty = {
  name: string;
  value: string | null;
};

/**
 * @public
 */
export type UiProductReview = {
  id: string;
  author: string;
  date: string;
  message: string | null;
  rating: number | null;
};
