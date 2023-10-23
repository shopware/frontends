<script setup lang="ts">
import type { OrderDocument } from "@shopware-pwa/types";
import { downloadFile } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  documents: OrderDocument[];
}>();

const { getDocumentFile } = useOrderDetails(props.documents[0].orderId);

const getMediaFileHandler = async (documentObject: OrderDocument) => {
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
    <h3 class="font-medium">{{ $t("account.documentsLabel") }}</h3>
    <ul class="list-disc pl-6">
      <li
        v-for="document in documents"
        :key="document.id"
        class="cursor-pointer"
        @click="() => getMediaFileHandler(document)"
      >
        <span class="text-brand-dark">{{
          document.config.title || document.config.name
        }}</span>
        ({{
          getDocumentDate(
            document.updatedAt ? document.updatedAt : document.createdAt,
          )
        }})
      </li>
    </ul>
  </div>
</template>
