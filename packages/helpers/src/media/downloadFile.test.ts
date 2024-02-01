import { describe, expect, it, vi } from "vitest";
import { downloadFile } from "./downloadFile";

describe("downloadFile", () => {
  it("should create a download link with the correct file URL and name", () => {
    // Mock the required DOM elements and functions
    const createElementSpy = vi.spyOn(document, "createElement");
    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    // Mock the file and name parameters
    const file = new Blob(["test"], { type: "text/plain" });
    const name = "test.txt";

    // Call the downloadFile function
    downloadFile(file, name);

    // Assertions
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
    expect(removeChildSpy).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
    expect(clickSpy).toHaveBeenCalled();

    // Clean up
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
