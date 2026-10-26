import type { Schemas, operations } from "#shopware";

type ReadCmsBody = operations["readCms post /cms/{id}"]["body"];
type CmsPage = Schemas["CmsPage"];
type CmsSection = Schemas["CmsSection"];
type CmsBlock = Schemas["CmsBlock"];
type CmsSlot = Schemas["CmsSlot"];
