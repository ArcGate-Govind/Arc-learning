import Cookies from "js-cookie";
import { accessTokenAPI } from "./auth";

export const setURLSession = (URL) => {
  Cookies.set("URL", JSON.stringify(URL));
};

export const getURL = () => {
  const urlStr = Cookies.get("URL");
  if (urlStr) return JSON.parse(urlStr);
  else return null;
};

export const removeURLSession = () => {
  Cookies.remove("URL");
};


export const setSecretSession = (secretKey) => {
  Cookies.set("SecretKey", JSON.stringify(secretKey));
};

export const getSecret = () => {
  const urlStr = Cookies.get("SecretKey");
  if (urlStr) return JSON.parse(urlStr);
  else return null;
};

export const removeSecretSession = () => {
  Cookies.remove("SecretKey");
};

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

export const accessTokenExpiryCheck = () => {
  const accessTokenExpiry = parseInt(Cookies.get("accessToken_expiration"));
  const timeUntilExpiry = accessTokenExpiry - Math.floor(Date.now() / 1000);

  if (60 >= timeUntilExpiry && timeUntilExpiry > 0) {
    accessTokenAPI();
  }
};

setInterval(accessTokenExpiryCheck, 60000);
