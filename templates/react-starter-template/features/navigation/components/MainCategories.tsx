import { getTranslatedProperty } from "@shopware/helpers";
import { connection } from "next/server";

import type { Schemas } from "#shopware";
import { readNavigation } from "@/platform/shopware/reads/navigation";

export async function MainCategories() {
  await connection();

  let categories: Schemas["NavigationRouteResponse"];
  try {
    categories = await readNavigation("main-navigation", 1);
  } catch (error) {
    console.error("[MainCategories] reading the main navigation failed", error);
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
