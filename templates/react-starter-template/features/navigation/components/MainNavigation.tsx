import { getCategoryUrl, getTranslatedProperty } from "@shopware/helpers";
import Link from "next/link";
import { connection } from "next/server";

import { readNavigation } from "@/platform/shopware/reads/navigation";

export async function MainNavigation() {
  await connection();

  const categories = await readNavigation("main-navigation", 1).catch(
    (error: unknown) => {
      console.error(
        "[MainNavigation] reading the main navigation failed",
        error,
      );
      return null;
    },
  );

  if (!categories) {
    return (
      <p className="text-sm text-states-error">
        The Store API could not be reached.
      </p>
    );
  }

  return (
    <nav aria-label="Main navigation">
      <ul role="menubar" className="flex flex-wrap gap-x-6 gap-y-2">
        {categories.map((category) => (
          <li key={category.id} role="none">
            <Link
              role="menuitem"
              href={getCategoryUrl(category)}
              className="text-sm font-semibold text-surface-on-surface hover:text-brand-primary"
            >
              {getTranslatedProperty(category, "name")}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
