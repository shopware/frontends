import { getTranslatedProperty } from "@shopware/helpers";
import { connection } from "next/server";

import { readNavigation } from "@/platform/shopware/reads/navigation";

export async function MainCategories() {
  await connection();

  const categories = await readNavigation("main-navigation", 1).catch(
    (error: unknown) => {
      console.error(
        "[MainCategories] reading the main navigation failed",
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
    <ul className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <li
          key={category.id}
          className="rounded-full border border-outline-outline-variant px-4 py-1 text-sm font-semibold"
        >
          {getTranslatedProperty(category, "name")}
        </li>
      ))}
    </ul>
  );
}
