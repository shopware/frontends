import type { Ref } from "vue";

declare module "#imports" {
  export function useI18n(): {
    locale: Ref<string>;
  };

  export function useExternalCms(): {
    resolvePage(
      path: string,
      locale: string,
    ): Promise<{
      title?: string;
      seo?: {
        title?: string;
        description?: string;
      };
      blocks: Array<{
        id: string;
        type: string;
        props: Record<string, unknown>;
      }>;
    } | null>;
  };

  export function groq(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): string;

  export function useSanityQuery<
    T = {
      title?: string;
      pageBuilder?: Array<Record<string, unknown>>;
    },
  >(query: string): Promise<{
    data: Ref<T | null>;
  }>;

  export function useAsyncStoryblok(
    slug: string,
    apiOptions?: Record<string, unknown>,
    bridgeOptions?: Record<string, unknown>,
  ): Promise<
    Ref<{
      status?: number;
      response?: string;
      content: Record<string, unknown>;
    }>
  >;

  export function useStrapi(): {
    findOne<T>(contentType: string): Promise<{
      data: {
        attributes: T;
      };
    }>;
    findOne<T>(
      contentType: string,
      id: string | number | undefined,
      params?: Record<string, unknown>,
    ): Promise<{
      data: Array<{
        attributes: T;
      }>;
    }>;
  };
}

declare module "nuxt/schema" {
  interface NuxtConfig {
    shopware?: {
      endpoint: string;
      accessToken: string;
    };
    sanity?: {
      projectId: string;
      dataset: string;
      apiVersion: string;
      useCdn: boolean;
    };
    storyblok?: {
      accessToken: string;
    };
  }
}

export {};
