import Link from "next/link";
import type { ComponentProps } from "react";

import type { NavigationNode } from "../navigationTree";

export type NavigationLinkProps = Omit<
  ComponentProps<"a">,
  "href" | "target" | "rel"
> & {
  node: NavigationNode;
};

export function NavigationLink({
  node,
  children,
  ...props
}: NavigationLinkProps) {
  if (node.external) {
    return (
      <a
        lang={node.lang}
        {...props}
        href={node.href}
        target="_blank"
        rel="noopener"
      >
        {children}
      </a>
    );
  }

  return (
    <Link lang={node.lang} {...props} href={node.href}>
      {children}
    </Link>
  );
}
