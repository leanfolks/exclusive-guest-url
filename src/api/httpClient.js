import axios from "axios";
// import { GUEST_ROUTES } from "../constants/routes";
import { BASE_URL, SESSION_ENV_KEY } from "../utils/config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(localStorage);
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
      //   authtoken: getParsedLocalStorageData(SESSION_ENV_KEY)?.token,
      // role: getParsedLocalStorageData("role")?.name,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem(SESSION_ENV_KEY);
      //   if (!Object.values(GUEST_ROUTES).includes(window.location.pathname))
      //     window.location.href = window.location.origin;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
