import Cookies from "js-cookie";
import { accessTokenAPI } from "./auth";

export const getUser = () => {
  const userStr = Cookies.get("user");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

export const getToken = () => {
  return Cookies.get("refreshToken") || null;
};

export const getAccessToken = () => {
  return Cookies.get("accessToken") || null;
};

export const removeUserSession = () => {
  Cookies.remove("refreshToken");
  Cookies.remove("user");
  Cookies.remove("accessToken");
};

export const setUserSession = (refreshToken, accessToken, user) => {
  const expirationTimeInSeconds = 2 * 60;

  const expirationDate = new Date();
  expirationDate.setTime(
    expirationDate.getTime() + expirationTimeInSeconds * 1000
  );

  Cookies.set("user", JSON.stringify(user), {
    expires: expirationDate,
  });
  Cookies.set("accessToken", accessToken, {
    expires: expirationDate,
  });

  const accessTokenExpiry = Math.floor(expirationDate.getTime() / 1000);
  Cookies.set("accessToken_expiration", accessTokenExpiry, {
    expires: expirationDate,
  });

  Cookies.set("refreshToken", refreshToken, {
    expires: expirationDate,
  });
};

export const getProjectName = () => {
  const projectStr = Cookies.get("projectname");
  if (projectStr) return JSON.parse(projectStr);
  else return null;
};

export const setProjectName = (projectname) => {
  const expirationTimeInSeconds = 30 * 60;

  const expirationDate = new Date();
  expirationDate.setTime(
    expirationDate.getTime() + expirationTimeInSeconds * 1000
  );

  Cookies.set("projectname", JSON.stringify(projectname), {
    expires: expirationDate,
  });
};

export const accessTokenExpiryCheck = () => {
  const accessTokenExpiry = parseInt(Cookies.get("accessToken_expiration"));
  const timeUntilExpiry = accessTokenExpiry - Math.floor(Date.now() / 1000);

  if (60 >= timeUntilExpiry && timeUntilExpiry > 0) {
    accessTokenAPI();
  }
};

setInterval(accessTokenExpiryCheck, 60000);
