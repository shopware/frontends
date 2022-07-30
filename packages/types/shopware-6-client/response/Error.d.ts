type ErrorTrace = {
  file: string;
  line: number;
  function: string;
  class: string;
  type: string;
  args: any[];
};

type Error = {
  status: string;
  code: string;
  title: string;
  detail: string;
  meta: unknown;
  trace?: ErrorTrace[];
};

/**
 * @public
 */
export type ErrorResponse = {
  errors: Error[];
};
