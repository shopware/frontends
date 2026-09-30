import { colors } from "./colors";

export { colors };

export const designTokenTheme = { colors };

export type DesignTokenColor = keyof typeof colors;
