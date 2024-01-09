import Cookies from "js-cookie";

const isLocalStorageAvailable =
  typeof window !== "undefined" && window.localStorage;

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
  const expirationTimeInSeconds = 30 * 60;

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
