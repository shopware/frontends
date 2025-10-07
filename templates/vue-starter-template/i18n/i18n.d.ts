import { ComponentCustomProperties } from "vue";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    // biome-ignore lint: ignoring type errors
    $t: (key: string, ...args: any[]) => string;
  }
}
