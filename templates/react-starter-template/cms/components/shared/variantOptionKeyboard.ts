export type VariantOptionKeyAction = "mark" | "commit";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

export function getVariantOptionKeyAction(
  key: string,
  hasPendingSelection: boolean,
): VariantOptionKeyAction | undefined {
  if (ARROW_KEYS.includes(key)) return "mark";
  if ((key === "Enter" || key === " ") && hasPendingSelection) return "commit";
  return undefined;
}
