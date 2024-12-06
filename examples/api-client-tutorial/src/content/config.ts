import { defineCollection } from "astro:content";
import { contentSchema } from "@tutorialkit/types";

const tutorial = defineCollection({
  type: "content",
  schema: contentSchema,
});

export const collections = { tutorial };
