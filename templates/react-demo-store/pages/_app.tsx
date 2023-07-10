import type { AppProps } from "next/app";
import { apiClient } from "@/app/apiClient";
import LayoutFooter from "@/components/LayoutFooter";

export default function MyApp({ Component, pageProps }: AppProps) {
  const context = apiClient.invoke("readContext get /context", {});

  return (
    <>
      <Component {...pageProps} />
      <LayoutFooter />
    </>
  );
}
