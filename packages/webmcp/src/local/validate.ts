/**
 * Minimal validation that mirrors the JSON schema each tool advertises. A tool
 * declares its bounds once; the schema sent to the browser and the check run
 * before execution come from the same declaration.
 */
import type { JsonSchema, ToolInput } from "../types";
import { WebMcpToolError } from "../types";

type StringParam = {
  type: "string";
  description: string;
  minLength?: number;
  maxLength: number;
  pattern?: string;
};

type IntegerParam = {
  type: "integer";
  description: string;
  minimum: number;
  maximum: number;
};

export type ParamSpec = StringParam | IntegerParam;

export type ParamsSpec = {
  properties: Record<string, ParamSpec>;
  required?: string[];
};

export function toJsonSchema(spec: ParamsSpec): JsonSchema {
  return {
    type: "object",
    properties: spec.properties,
    ...(spec.required && spec.required.length > 0
      ? { required: spec.required }
      : {}),
    additionalProperties: false,
  };
}

function invalid(message: string): never {
  throw new WebMcpToolError(message, "invalid_input");
}

/** Returns a copy of `input` holding only declared, valid parameters. */
export function validateInput(spec: ParamsSpec, input: ToolInput): ToolInput {
  const output: ToolInput = {};
  for (const name of spec.required ?? []) {
    if (input[name] === undefined || input[name] === null) {
      invalid(`Parameter "${name}" is required`);
    }
  }
  for (const [name, param] of Object.entries(spec.properties)) {
    const value = input[name];
    if (value === undefined || value === null) continue;
    if (param.type === "string") {
      if (typeof value !== "string") {
        invalid(`Parameter "${name}" must be a string`);
      }
      const trimmed = value.trim();
      if (trimmed.length < (param.minLength ?? 0)) {
        invalid(`Parameter "${name}" is too short`);
      }
      if (trimmed.length > param.maxLength) {
        invalid(`Parameter "${name}" is longer than ${param.maxLength}`);
      }
      if (param.pattern && !new RegExp(param.pattern).test(trimmed)) {
        invalid(`Parameter "${name}" has an invalid format`);
      }
      output[name] = trimmed;
    } else {
      const number = typeof value === "string" ? Number(value) : value;
      if (typeof number !== "number" || !Number.isInteger(number)) {
        invalid(`Parameter "${name}" must be an integer`);
      }
      if (number < param.minimum || number > param.maximum) {
        invalid(
          `Parameter "${name}" must be between ${param.minimum} and ${param.maximum}`,
        );
      }
      output[name] = number;
    }
  }
  return output;
}
