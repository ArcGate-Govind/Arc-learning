import { API_URL } from "../../constant";
import { getToken, getUser, removeUserSession, setUserSession } from "./common";

export const accessTokenAPI = async () => {
  const refresh = getToken();
  const userName = getUser();
  const response = await fetch(`${API_URL}token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const json = await response.json();
  if (response.status == 200) {
    setUserSession(refresh, json.access, userName);
  } else {
    removeUserSession();
  }
  return json;
};
