<script setup lang="ts">
import { downloadFile } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const props = defineProps<{
  documents: Schemas["Document"][];
}>();

if (!props.documents.length || !props.documents[0]?.orderId) {
  throw new Error(
    "AccountOrderDownloads requires at least one document with orderId",
  );
}

const { getDocumentFile } = useOrderDetails(props.documents[0].orderId);

const getMediaFileHandler = async (documentObject: Schemas["Document"]) => {
  const response = await getDocumentFile(
    documentObject.id,
    documentObject.deepLinkCode,
  );
  downloadFile(
    response,
    `${documentObject.config.name}.${documentObject.fileType}`,
  );
};

const getDocumentDate = (documentDate: Date | string) =>
  new Date(documentDate).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  );
</script>
<template>
  <div>
    <h3 class="text-surface-on-surface font-bold leading-normal mb-3">
      {{ $t("account.documentsLabel") }}
    </h3>
    <ul class="flex flex-col gap-2">
      <li
        v-for="document in documents"
        :key="document.id"
        class="cursor-pointer"
        @click="() => getMediaFileHandler(document)"
      >
        <span
          class="text-brand-primary border-b border-brand-primary hover:border-transparent transition-all duration-200 inline-flex items-center gap-2"
        >
          <span class="w-4 h-4 i-carbon-download" />
          {{ document.config.title || document.config.name }}
          <span class="text-surface-on-surface-variant border-none">
            ({{
              getDocumentDate(
                document.updatedAt
                  ? document.updatedAt
                  : (document.createdAt ?? ""),
              )
            }})
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
