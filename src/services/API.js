/*
 * This is the initial API interface
 * we set the base URL for the API
 * store the token in local storage
 * append the token to all requests
 ? Both request & response are logged to the console.
 ! Remove the console logs for production.
*/

import axios from "axios";
import store from "../store/store";

export const apiClient = axios.create({
  baseURL: "http://airlock-example.test/api",
  withCredentials: true
});

/*
 * Add a request interceptor
 @param config
*/
apiClient.interceptors.request.use(
  function(config) {
    const token = window.localStorage.getItem("token");
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error.response);
  }
);

/*
 * Add a response interceptor
 */
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      store.dispatch("auth/logout");
    }
    if (error.response.status === 403) {
      // eslint-disable-next-line no-console
      console.log("403 error status");
    }
    if (error.response.status === 503) {
      // eslint-disable-next-line no-console
      console.log("503 error status");
    }
    // TODO Remove for go live
    // eslint-disable-next-line no-console
    console.log(error);
    return Promise.reject(error.response);
  }
);