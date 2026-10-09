import Link from "next/link";

import type { NavigationNode } from "@/features/navigation/navigationTree";

export function FooterColumns({ tree }: { tree: NavigationNode[] }) {
  return (
    <>
      {tree.map((node) => (
        <div key={node.id} className="flex min-w-0 flex-col gap-4">
          <p
            lang={node.lang}
            className="text-xs font-semibold tracking-wide text-shell-on-ink uppercase"
          >
            {node.name}
          </p>
          {node.children.length > 0 ? (
            <ul className="flex list-none flex-col gap-2.5">
              {node.children.map((child) => (
                <li key={child.id}>
                  <Link
                    lang={child.lang}
                    href={child.href}
                    target={child.external ? "_blank" : undefined}
                    rel={child.external ? "noopener" : undefined}
                    className="rounded-sm text-sm text-shell-on-ink-muted transition-colors hover:text-shell-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
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
