import { readFileSync } from "node:fs";

import { defineLoader } from "vitepress";

const DOCS_BASE = "https://developer.shopware.com/frontends";

export interface Template {
  id: string;
  displayName: string;
  purpose: string;
  supportLevel: "supported" | "example" | "deprecated";
  scaffoldable: boolean;
  scaffoldCommand: string | null;
  devcontainer: boolean;
  devPort: number;
  notes?: string;
  /** Site-relative page, or null when the template has no docs page yet. */
  link: string | null;
}

export interface Data {
  templates: Template[];
}

declare const data: Data;
export { data };

export default defineLoader({
  async load(): Promise<Data> {
    const cwd = process.cwd();
    const projectRootDir = cwd.endsWith("/apps/docs")
      ? `${cwd}/../..`
      : `${cwd}/src/frontends/_source`;

    const manifest = JSON.parse(
      readFileSync(`${projectRootDir}/templates/manifest.json`, "utf8"),
    );

    return {
      templates: manifest.templates.map((template) => ({
        id: template.id,
        displayName: template.displayName,
        purpose: template.purpose,
        supportLevel: template.supportLevel,
        scaffoldable: template.scaffoldable,
        scaffoldCommand: template.scaffoldCommand,
        devcontainer: template.devcontainer,
        devPort: template.devPort,
        notes: template.notes,
        link: template.docsUrl
          ? template.docsUrl.slice(DOCS_BASE.length)
          : null,
      })),
    };
  },
});
