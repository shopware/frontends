<script setup lang="ts">
import { NuxtLink } from "#components";

interface SeoUrl {
  isCanonical: boolean;
  seoPathInfo: string;
}

interface ButtonConfig {
  url: string | null;
  type: "internal" | "external" | null;
  title: string;
  entity: string | null;
  newTab: boolean;
  entity_id: string | null;
  link?: {
    seoUrls?: SeoUrl[];
  };
}

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const route = useRoute();

const props = defineProps<{
  button: ButtonConfig;
  class: string;
  isInnerHtml?: boolean;
  activeClass?: string;
}>();

const buttonConfig = props.button;
const btnClass = props.class;
const isInnerHtml = props.isInnerHtml;
const activeClass = props.activeClass;

const getButtonUrl = (config: ButtonConfig) => {
  if (config.type === "external" && config.url) {
    return config.url;
  }

  if (config.link?.seoUrls?.length) {
    const canonicalUrl = config.link.seoUrls.find((url) => url.isCanonical === true);
    if (canonicalUrl) {
      return formatLink("/" + canonicalUrl.seoPathInfo);
    }
  }

  // TODO this is a temporary solution need to update this logic
  if (config.link?.id) {
    return formatLink("/navigation/" + config.link?.id);
  }

  if (config.url) {
    return config.url;
  }

  return "#";
};

const buttonUrl = computed(() => getButtonUrl(buttonConfig));

const isActiveLink = computed(() => buttonUrl.value === route.path);

const buttonClasses = computed(() => ({
  [btnClass]: true,
  [activeClass || ""]: isActiveLink.value,
}));
</script>

<template>
  <NuxtLink
    v-if="buttonConfig"
    :to="buttonUrl"
    :external="buttonConfig.type === 'external' ? true : false"
    :title="buttonConfig.title"
    :target="buttonConfig.newTab ? '_blank' : '_self'"
    :class="buttonClasses"
  >
    <template v-if="isInnerHtml">
      <slot>

      </slot>
    </template>
    <template v-else>
       {{ buttonConfig.title }}
    </template>
  </NuxtLink>
</template>