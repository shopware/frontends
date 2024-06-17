/**
 * These should be omited in result file
 */

export type paths = {};

export type webhooks = Record<string, never>;
export type components = {
  schemas: {};
  parameters: {
    /** Accepted response content types */
    accept: string;
    /** Content type of the request */
    contentType: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
};

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = {};

export type operationPaths = string;
