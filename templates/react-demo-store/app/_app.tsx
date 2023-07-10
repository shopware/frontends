import type { AppProps } from "next/app";
import { apiClient } from "@/app/apiClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  const context = apiClient.invoke("readContext get /context", {});

  return (
    // <DefaultLayout>
    <Component {...pageProps} />
    // </DefaultLayout>
  );
}
