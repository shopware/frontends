import { FetchResponse } from "ofetch";

export type ApiError = {
  title?: string;
  detail?: string;
  code?: string;
  status?: string;
  source?: {
    pointer?: string;
  };
  meta?: {
    parameters?: Record<string, string>;
  };
};

export class ApiClientError<
  T extends { errors: Array<ApiError> },
> extends Error {
  /**
   * Flag to indicate if the request was successful.
   */
  public ok: boolean;
  /**
   * HTTP status code of the response.
   */
  public status: number;
  /**
   * HTTP status text of the response.
   */
  public statusText?: string;
  /**
   * URL of the request.
   */
  public url: string;
  /**
   * Details of the error.
   */
  public details: T;
  /**
   * Headers of the response.
   */
  public headers: Headers;

  constructor(response: FetchResponse<T>) {
    let message = "Failed request";
    message += response._data?.errors.reduce((message, error) => {
      let pointer = "";
      if (error.source?.pointer) {
        pointer = `[${error.source.pointer}]`;
      }
      return `${message}\n - [${error.title}]${pointer} ${error.detail}`;
    }, "");
    super(message);

    this.name = "ApiClientError";
    this.details =
      response._data ||
      ({
        errors: [{ title: "Unknown error", detail: "" }],
      } as T);
    this.ok = response.ok;
    this.status = response.status;
    this.statusText = response.statusText;
    this.url = response.url;
    this.headers = response.headers;
  }
}

export function errorInterceptor<T extends { errors: Array<ApiError> }>(
  response: FetchResponse<T>,
) {
  throw new ApiClientError(response);
}
