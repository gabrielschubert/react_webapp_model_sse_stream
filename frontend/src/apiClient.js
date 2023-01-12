import axios from "axios";
import store from "./store";

var baseURL = `http://10.20.66.39:8081`

export const axiosClient = axios.create({
  baseURL: baseURL,
  xsrfHeaderName: "X-CSRF-TOKEN",
  xsrfCookieName: "csrf_access_token",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status) {
      const state = store.getState();
      if (state.authentication.logged) {
        store.dispatch({ type: "USER_LOGOUT" });
        alert("Sua sessão expirou, faça o login novamente.");
        window.location.reload();
      }
    }
    console.error("Error intercepted.");
    return Promise.reject(error);
  }
);
