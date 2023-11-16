import * as cookies from "js-cookie";
import {
  getUser,
  getToken,
  getAccessToken,
  removeUserSession,
  setUserSession,
} from "../../src/utils/common";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("Cookie Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get user data from Cookies", () => {
    cookies.get.mockReturnValue(JSON.stringify({ username: "testUser" }));

    const user = getUser();
    expect(user).toEqual({ username: "testUser" });
    expect(cookies.get).toHaveBeenCalledWith("user");
  });

  it("should return null when no user data in Cookies", () => {
    cookies.get.mockReturnValue(null);

    const user = getUser();
    expect(user).toBeNull();
    expect(cookies.get).toHaveBeenCalledWith("user");
  });

  it("should get the refresh token from Cookies", () => {
    cookies.get.mockReturnValue("refreshToken123");

    const refreshToken = getToken();
    expect(refreshToken).toEqual("refreshToken123");
    expect(cookies.get).toHaveBeenCalledWith("refreshToken");
  });

  it("should return null when no refresh token in Cookies", () => {
    cookies.get.mockReturnValue(null);

    const refreshToken = getToken();
    expect(refreshToken).toBeNull();
    expect(cookies.get).toHaveBeenCalledWith("refreshToken");
  });

  it("should get the access token from Cookies", () => {
    cookies.get.mockReturnValue("accessToken456");

    const accessToken = getAccessToken();
    expect(accessToken).toEqual("accessToken456");
    expect(cookies.get).toHaveBeenCalledWith("accessToken");
  });

  it("should return null when no access token in Cookies", () => {
    cookies.get.mockReturnValue(null);

    const accessToken = getAccessToken();
    expect(accessToken).toBeNull();
    expect(cookies.get).toHaveBeenCalledWith("accessToken");
  });

  it("should remove user session from Cookies", () => {
    removeUserSession();
    expect(cookies.remove).toHaveBeenCalledWith("refreshToken");
    expect(cookies.remove).toHaveBeenCalledWith("user");
    expect(cookies.remove).toHaveBeenCalledWith("accessToken");
  });

  it("should set user session in Cookies", () => {
    const user = { username: "testUser" };
    const refreshToken = "refreshToken123";
    const accessToken = "accessToken456";

    setUserSession(refreshToken, accessToken, user);

    expect(cookies.set).toHaveBeenCalledWith(
      "user",
      JSON.stringify(user),
      expect.any(Object)
    );
    expect(cookies.set).toHaveBeenCalledWith(
      "accessToken",
      accessToken,
      expect.any(Object)
    );
    expect(cookies.set).toHaveBeenCalledWith(
      "refreshToken",
      refreshToken,
      expect.any(Object)
    );
  });
});
