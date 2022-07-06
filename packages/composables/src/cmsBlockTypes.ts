import { CmsBlock, CmsSlot } from "@shopware-pwa/commons";

export type CmsBlockImageText = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left" | "right";
    }
  >;
};
export type CmsBlockProductListing = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "content";
    }
  >;
};
export type CmsBlockGalleryBuybox = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left" | "right";
    }
  >;
};

export type CmsBlockSidebarFilter = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "content";
    }
  >;
};

export type CmsBlockCategoryNavigation = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "content";
    }
  >;
};

export type CmsBlockCenterText = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left" | "right" | "center";
    }
  >;
};
export type CmsBlockImageBubbleRow = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left" | "right" | "center";
    }
  >;
};
export type CmsBlockImageFourColumn = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left" | "right" | "center-left" | "center-right";
    }
  >;
};
export type CmsBlockImageHighlightRow = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left" | "right" | "center";
    }
  >;
};
export type CmsBlockImageSimpleGrid = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot: "left-top" | "left-bottom" | "right";
    }
  >;
};

export type CmsBlockImageTextBubble = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot:
        | "left-text"
        | "left-image"
        | "center-text"
        | "center-image"
        | "right-text"
        | "right-image";
    }
  >;
};
export type CmsBlockImageTextGallery = CmsBlock & {
  slots: Array<
    CmsSlot & {
      slot:
        | "left-image"
        | "center-image"
        | "right-image"
        | "left-text"
        | "center-text"
        | "right-text";
    }
  >;
};
