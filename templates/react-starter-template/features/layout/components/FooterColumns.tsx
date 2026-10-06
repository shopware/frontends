import Link from "next/link";

import type { NavigationNode } from "@/features/navigation/navigationTree";

export function FooterColumns({ tree }: { tree: NavigationNode[] }) {
  return (
    <>
      {tree.map((node) => (
        <div key={node.id} className="flex flex-col gap-4">
          <p
            lang={node.lang}
            className="font-semibold text-surface-inverse-on-surface"
          >
            {node.name}
          </p>
          {node.children.length > 0 ? (
            <ul className="flex list-none flex-col gap-2">
              {node.children.map((child) => (
                <li key={child.id}>
                  <Link
                    lang={child.lang}
                    href={child.href}
                    target={child.external ? "_blank" : undefined}
                    rel={child.external ? "noopener" : undefined}
                    className="text-surface-surface-primary hover:text-surface-inverse-on-surface"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </>
  );
}
