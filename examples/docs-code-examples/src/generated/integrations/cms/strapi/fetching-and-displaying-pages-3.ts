import { provide } from "#imports";

import { useSWStrapi } from "./fetching-and-displaying-pages-2";

const { resolveComponent } = useSWStrapi();
provide("pageRenderMiddlewares", resolveComponent);
