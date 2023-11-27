type ErrorTrace = {
  file: string;
  line: number;
  function: string;
  class: string;
  type: string;
  args: unknown[];
};

type Error = {
  status: string;
  code: string;
  title: string;
  detail: string;
  meta?: {
    parameters?: {
      [key: string]: string;
    };
  };
  trace?: ErrorTrace[];
  source?: {
    pointer: string;
  };
};

/**
 * @public
 */
export type ErrorResponse = {
  errors: Error[];
};
