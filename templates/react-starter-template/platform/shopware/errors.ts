import "server-only";
import { ApiClientError } from "@shopware/api-client";
import { notFound } from "next/navigation";

export function notFoundOn404(error: unknown): never {
  if (error instanceof ApiClientError && error.status === 404) {
    notFound();
  }
  throw error;
}
