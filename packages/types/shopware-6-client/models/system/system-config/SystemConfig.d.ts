import { SalesChannel } from "../sales-channel/SalesChannel";

/**
 * @public
 */
export type SystemConfig = {
  configurationKey: string;
  configurationValue: unknown;
  salesChannelId: string | null;
  salesChannel: SalesChannel | null;
};
