import "server-only";
import { cacheLife } from "next/cache";

export async function catalogNow(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return Date.now();
}
