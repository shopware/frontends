<script setup lang="ts">
import type { CmsElementText } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import { h } from "vue";
import { decodeHTML } from "entities";
import { CSSProperties } from "vue";
import {
  getOptionsFromNode,
  NodeObject,
} from "../../../../helpers/html-to-vue/getOptionsFromNode";
import { renderHtml } from "../../../../helpers/html-to-vue/renderToHtml";

const props = defineProps<{
  content: CmsElementText;
}>();
const context = getCurrentInstance();
const { getConfigValue } = useCmsElementConfig(props.content);

const mappedContent = computed<string>(() => {
  return props.content?.data?.content || getConfigValue("content");
});

const style = computed<CSSProperties>(() => ({
  alignItems: getConfigValue("verticalAlign"),
}));

const hasVerticalAlignment = computed(() => !!style.value.alignItems);

const CmsTextRender = () => {
  const config = {
    textTransformer: (text: string) => decodeHTML(text),
    extraComponentsMap: {
      link: {
        conditions(node: NodeObject) {
          return (
            node.type === "tag" &&
            node.name === "a" &&
            !node.attrs?.class?.match(/btn\s?/)
          );
        },
        renderer(node: any, children: any, createElement: any) {
          return createElement(
            "a",
            {
              class:
                "underline text-base font-normal text-brand-primary hover:text-gray-900",
              ...getOptionsFromNode(node).attrs,
            },
            [...children]
          );
        },
      },
      button: {
        conditions(node: NodeObject) {
          return (
            node.type === "tag" &&
            node.name === "a" &&
            node.attrs?.class?.match(/btn\s?/)
          );
        },
        renderer(node: NodeObject, children: any, createElement: any) {
          let _class = "";
          if (node?.attrs?.class) {
            const btnClass =
              "rounded-md inline-block my-2 py-2 px-4 border border-transparent text-sm font-medium focus:outline-none disabled:opacity-75";

            _class = node.attrs.class
              .replace("btn-secondary", `${btnClass} bg-brand-dark text-white`)
              .replace(
                "btn-primary",
                `${btnClass} bg-brand-primary text-white`
              );
          }

          return createElement(
            "a",
            {
              class: _class,
              ...getOptionsFromNode(node).attrs,
            },
            [...children]
          );
        },
      },
      font: {
        conditions(node: NodeObject) {
          return node.type === "tag" && node.name === "font";
        },
        renderer(node: NodeObject, children: any, createElement: any) {
          // convert from <font color="#ce0000">Headline 1</font> to <span style="color:#ce0000">Headline 1</span>
          let newStyle = null;
          const styleColor = node?.attrs?.color;
          if (styleColor) {
            const currentStyle = node.attrs?.style ?? "";
            newStyle = `color:${styleColor};${currentStyle}`;
            delete node.attrs?.color;
          }

          return createElement(
            "span",
            {
              style: newStyle,
              ...getOptionsFromNode(node).attrs,
            },
            [...children]
          );
        },
      },
    },
  };
  const rawHtml =
    mappedContent.value?.length > 0 ? mappedContent.value : "<div></div>";
  return renderHtml(rawHtml, config, h, context);
};
</script>
<template>
  <div
    :class="{ flex: hasVerticalAlignment, 'flex-row': hasVerticalAlignment }"
    :style="style"
  >
    <CmsTextRender />
  </div>
</template>
<style scoped>
/** Global CSS styles for text elements */
h1,
h2,
h3,
h4,
h5 {
  margin-bottom: 10px;
  font-weight: 600;
}
h1 {
  line-height: 2.5rem;
  font-size: 2.25rem;
}
h2 {
  line-height: 2rem;
  font-size: 1.75rem;
}
h3 {
  line-height: 1.5rem;
  font-size: 1.25rem;
}
ol,
ul,
dl {
  list-style-type: disc;
  padding-left: 40px;
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
