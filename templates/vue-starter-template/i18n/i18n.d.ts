import { ComponentCustomProperties } from "vue";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    // TODO: Improve this typing.
    $t: (key: string, ...args: any[]) => string;
  }
}
