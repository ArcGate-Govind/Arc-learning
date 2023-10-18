import Cookies from "js-cookie";

// return the user data from the Cookies storage
export const getUser = () => {
  const userStr = Cookies.get("user");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the Cookies storage
export const getToken = () => {
  return Cookies.get("refreshtoken") || null;
};
// return the accessToken from the Cookies storage
export const getaccessToken = () => {
  return Cookies.get("accessToken") || null;
};
// remove the token and user from the Cookies storage
export const removeUserSession = () => {
  Cookies.remove("refreshtoken");
  Cookies.remove("user");
  Cookies.remove("accessToken");
  localStorage.removeItem("currentPage");

};

// set the token and user from the Cookies storage
export const setUserSession = (refreshtoken, accessToken, user) => {
  //Calculate the expiration time in seconds (e.g., 30 minutes)
  const expirationTimeInSeconds = 30 * 60;

  // Calculate the expiration date
  const expirationDate = new Date();
  expirationDate.setTime(
    expirationDate.getTime() + expirationTimeInSeconds * 1000
  );

  Cookies.set("user", JSON.stringify(user), {
    expires: expirationDate,
  });
  // sessionStorage.setItem('accessToken', accessToken);
  Cookies.set("accessToken", accessToken, {
    expires: expirationDate,
  });
  Cookies.set("refreshtoken", refreshtoken, {
    expires: expirationDate,
  });
};
