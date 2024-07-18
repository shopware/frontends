import { getOptionsFromNode } from "./getOptionsFromNode";
import type { NodeObject } from "./getOptionsFromNode";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("getOptionsFromNode", () => {
  const consoleErrorSpy = vi.spyOn(console, "error");
  const urlResolverMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy.mockImplementation(() => {});
    urlResolverMock.mockImplementation((url) => "resolved-url" + url);
  });

  it("should return empty object if node is undefined", () => {
    const options = getOptionsFromNode(
      undefined as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      attrs: {},
    });
  });

  it("should return options object with style, classNames, and align", () => {
    const node = {
      attrs: {
        style: "color: red",
        class: "my-class",
        align: "center",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      style: "color: red",
      class: "my-class",
      align: "center",
      attrs: {},
    });
  });

  it("should return options object without style, classNames, and align if they are not present in node.attrs", () => {
    const node = {
      attrs: {},
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      attrs: {},
    });
  });

  it("should return empty object when no attrs in node", () => {
    const node = {
      attrs: undefined,
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      attrs: {},
    });
  });

  it("should resolve URL if attrs.href exists", () => {
    const node = {
      attrs: {
        href: "/path/to/page",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs.href).toEqual("resolved-url/path/to/page");
  });

  it('should add additional attrs to "attrs" object', () => {
    const node = {
      attrs: {
        href: "/path/to/page",
        "data-test": "test",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs.href).toEqual("resolved-url/path/to/page");
    expect(options.attrs["data-test"]).toEqual("test");
  });

  it("should show console error if something went wrong", () => {
    const node = {
      attrs: {
        href: "/path/to/page",
      },
    };

    const consoleErrorSpy = vi.spyOn(console, "error");

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      undefined as any,
    );

    expect(options).toEqual({
      attrs: {},
    });
    expect(consoleErrorSpy).toBeCalled();
  });
});
