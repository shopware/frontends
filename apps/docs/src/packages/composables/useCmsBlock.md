---
category: CMS
---

# useCmsBlock

<!-- PLACEHOLDER_DESCRIPTION -->

## Usage

It can be used in a block context, where there is an access to the slots, available for specific block.

```ts
const props = defineProps<{
  // type reflects the context of the block
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const centerContent = getSlotContent("center");
```
