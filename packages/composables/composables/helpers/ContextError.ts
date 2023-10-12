export default class ContextError extends Error {
  constructor(scope: string, message?: string) {
    super(`${scope} ${message ? message : "context is not provided"}`);
    this.name = "ContextError";
  }
}
