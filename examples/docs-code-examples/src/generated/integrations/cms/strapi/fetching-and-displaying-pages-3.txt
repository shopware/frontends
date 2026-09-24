import { provide, resolveComponent } from "#imports";

const { resolveComponent } = useSWStrapi();
provide("pageRenderMiddlewares", resolveComponent);
