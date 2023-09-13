import { CmsSection } from "@shopware-pwa/types";

export const urlsTestCaseOne: { [key: string]: string } = {
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg?height=1900&fit=crop,smart")',
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?height=1900&fit=crop,smart")',
  "url(http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?height=1900&fit=crop,smart")',
  "url(wrongUrl)": 'url("wrongUrl?height=1900&fit=crop,smart")',
};

export const urlsTestCaseTwo: { [key: string]: string } = {
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg?width=1000&fit=crop,smart")',
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?width=1000&fit=crop,smart")',
  "url(http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?width=1000&fit=crop,smart")',
  "url(wrongUrl)": 'url("wrongUrl?width=1000&fit=crop,smart")',
};

export const urlsTestCaseThree: { [key: string]: string } = {
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg?height=900&fit=crop,smart")',
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?height=900&fit=crop,smart")',
  "url(http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?height=900&fit=crop,smart")',
  "url(wrongUrl)": 'url("wrongUrl?height=900&fit=crop,smart")',
};

export const urlsTestCaseFour: { [key: string]: string } = {
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg?height=800&fit=crop,smart")',
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?height=800&fit=crop,smart")',
  "url(http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?height=800&fit=crop,smart")',
  "url(wrongUrl)": 'url("wrongUrl?height=800&fit=crop,smart")',
};

export const urlsTestCaseFive: { [key: string]: string } = {
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg?width=2000&fit=crop,smart")',
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?width=2000&fit=crop,smart")',
  "url(http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?width=2000&fit=crop,smart")',
  "url(wrongUrl)": 'url("wrongUrl?width=2000&fit=crop,smart")',
};

export const urlsTestCaseSix: { [key: string]: string } = {
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/78/5f/f9/tyler-nix-573049-unsplash.jpg?width=1900&fit=crop,smart")',
  "url(https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("https://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?width=1900&fit=crop,smart")',
  "url(http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg)":
    'url("http://cdn.shopware.store/a/B/m/pPkDE/media/48/44/7a/stephan-valentin-640852-unsplash.jpg?width=1900&fit=crop,smart")',
  "url(wrongUrl)": 'url("wrongUrl?width=1900&fit=crop,smart")',
};

export const urlsTestCaseSeven: { [key: string]: string } = {
  haha: 'url("haha?width=2000&fit=crop,smart")',
};

export const cmsSectionTestCaseOne: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    metaData: {
      type: 2,
      width: 1380,
      height: 3588,
    },
    apiAlias: "cms_media",
  },
};

export const cmsSectionTestCaseTwo: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    metaData: {
      type: 2,
      width: 901,
      height: 900,
    },
    apiAlias: "cms_media",
  },
};

export const cmsSectionTestCaseThree: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    metaData: {
      type: 2,
      width: 900,
      height: 900,
    },
    apiAlias: "cms_media",
  },
};

export const cmsSectionTestCaseFour: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    // @ts-ignore test when width and height are missing
    metaData: {
      type: 2,
    },
    apiAlias: "cms_media",
  },
};

export const cmsSectionTestCaseFive: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    metaData: {
      type: 2,
      width: 1910,
      height: 900,
    },
    apiAlias: "cms_media",
  },
};

export const cmsSectionTestCaseSix: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    metaData: {
      type: 2,
      width: 1921,
      height: 900,
    },
    apiAlias: "cms_media",
  },
};

export const cmsSectionTestCaseSeven: Partial<CmsSection> = {
  backgroundMedia: {
    url: "",
    createdAt: "2020-08-06T06:25:57.072+00:00",
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    metaData: {
      type: 2,
      width: 1910,
      height: 900,
    },
    apiAlias: "cms_media",
  },
};
