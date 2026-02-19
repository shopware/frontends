import { defineAppConfig } from "#imports";

export default defineAppConfig({
  imagePlaceholder: {
    color: "#543B95",
  },
  backgroundImage: {
    format: "webp",
    quality: 90,
  },
  imageSizes: {
    1: "(max-width: 768px) 100vw, 100vw",
    2: "(max-width: 768px) 100vw, 50vw",
    3: "(max-width: 768px) 100vw, 33vw",
    default: "(max-width: 768px) 50vw, 25vw",
  },
  unocssRuntime: true,
});
