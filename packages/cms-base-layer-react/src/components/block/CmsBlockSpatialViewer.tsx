import type { CSSProperties } from "react";

import type { Schemas } from "#shopware";

import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";

function readSlotConfigValue(
  slot: Schemas["CmsSlot"] | undefined,
  key: string,
): unknown {
  if (!slot?.config || typeof slot.config !== "object") return null;
  const configEntry = (slot.config as Record<string, unknown>)[key];
  if (
    configEntry &&
    typeof configEntry === "object" &&
    "value" in configEntry
  ) {
    return (configEntry as { value: unknown }).value;
  }
  return null;
}

function getModelUrl(slot: Schemas["CmsSlot"] | undefined): string | null {
  const data = slot?.data as unknown as Schemas["Media"] | undefined;
  if (data?.url && typeof data.url === "string") {
    return data.url;
  }
  const configUrl = readSlotConfigValue(slot, "url");
  if (typeof configUrl === "string" && configUrl) {
    return configUrl;
  }
  return null;
}

function getAspectRatio(formFactor: string): number {
  switch (formFactor) {
    case "square":
      return 1;
    case "landscape":
      return 16 / 9;
    case "portrait":
      return 9 / 16;
    default:
      return 1;
  }
}

export function CmsBlockSpatialViewer({
  content,
  className,
  style,
}: CmsComponentProps<Schemas["CmsBlock"]>) {
  const slotContent = getSlotContent(content, "default");
  const modelUrl = getModelUrl(slotContent);

  const height = readSlotConfigValue(slotContent, "maxHeight");
  const maxHeight = typeof height === "string" ? height : "600px";

  const factor = readSlotConfigValue(slotContent, "formFactor");
  const formFactor = typeof factor === "string" ? factor : "square";

  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: "400px",
    maxHeight,
    aspectRatio: `${getAspectRatio(formFactor)}`,
    position: "relative",
  };

  return (
    <div
      className={cx("cms-block-spatial-viewer", className)}
      style={{ ...containerStyle, ...style }}
    >
      <div className="w-full h-full flex items-center justify-center bg-surface-surface-container">
        <span className="text-gray-500">3D Viewer</span>
        {modelUrl && <span className="sr-only">{modelUrl}</span>}
      </div>
    </div>
  );
}
