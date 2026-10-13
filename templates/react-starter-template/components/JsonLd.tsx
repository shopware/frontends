import { serializeJsonLd } from "@/platform/seo/jsonLd";
import type { JsonLdObject } from "@/platform/seo/jsonLd";

export function JsonLd({ data }: { data: JsonLdObject | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
