import { sendContactForm } from "../formsService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("FormService - sendContactForm", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should invoke correct API endpoint with given parameters", async () => {
    await sendContactForm({
      salutationId: "2a69a6c523034b108a3bc292ef4c8891",
      firstName: "John",
      lastName: "Doe",
      email: "John@Doe.com",
      phone: "123456789",
      subject: "Best form test",
      comment: "Please do not reply for this email.",
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/contact-form", {
      salutationId: "2a69a6c523034b108a3bc292ef4c8891",
      firstName: "John",
      lastName: "Doe",
      email: "John@Doe.com",
      phone: "123456789",
      subject: "Best form test",
      comment: "Please do not reply for this email.",
    });
  });

  it("should throw an error when data is incorrect", async () => {
    mockedPost.mockRejectedValueOnce(new Error("400"));
    expect(sendContactForm({} as any)).rejects.toThrowError("400");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/contact-form", {});
  });
});
