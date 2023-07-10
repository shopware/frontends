import type { PluginOption } from "vite";

const hasDisabled = (block: string) => block.match(/\:disabled\=/gm);

function VueDisableInputsBeforeMount(): PluginOption {
  return {
    name: "vite-vue-disable-inputs-before-mount",
    enforce: "pre",
    transform(code, id) {
      if (
        id.endsWith(".vue") &&
        (code.includes("<select") ||
          code.includes("<button" || code.includes("<input")))
      ) {
        let component = code;

        const foundScriptBlocks =
          component.match(/<script setup(.*\s?)([\s\S]*?)?\<\/script\>/gm) ||
          [];
        if (!foundScriptBlocks.length) {
          return null;
        }

        const foundScriptBlock = foundScriptBlocks[0];
        if (!foundScriptBlock) {
          console.error("no script section found");
          return null;
        }
        // add isDisabled ref with true value
        // add onMounted hook to change isDisabled to false
        component = component.replace(
          foundScriptBlock,
          foundScriptBlock.replace(
            "</script>",
            `
          const isDisabled = ref(true);
          onMounted(() => {
            isDisabled.value = false;
          });

          </script>
          `
          )
        );

        const foundSelectElements =
          component.match(/<(select|input|button)(.*\s?)([\s\S]*?)?\>/gm) || [];

        for (const selectBlock of foundSelectElements) {
          if (hasDisabled(selectBlock)) {
            // inject isDisabled ref to existing :disabled
            component = component.replace(
              selectBlock,
              selectBlock.replace(':disabled="', ':disabled="isDisabled || ')
            );

            continue;
          }

          // add :disabled attribute together with isDisabled ref
          component = component.replace(
            selectBlock,
            selectBlock
              .replace("<select", '<select :disabled="isDisabled"')
              .replace("<button", '<button :disabled="isDisabled"')
              .replace("<input", '<input :disabled="isDisabled"')
          );
        }

        return { code: component, id };
      }

      return null;
    },
  };
}

export { VueDisableInputsBeforeMount };
