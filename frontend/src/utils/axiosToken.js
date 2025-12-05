import axios from "axios";
import { jwtDecode } from "jwt-decode";

let accessToken = "";
let exp = 0;

export const setAuthToken = (token) => {
  accessToken = token;
  const decode = jwtDecode(token);
  exp = decode.exp;
};

export const clearAuthToken = () => {
  accessToken = "";
  exp = 0;
};

const axiosToken = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosToken.interceptors.request.use(
  async (config) => {
    const currentTime = Date.now() / 1000;

    if (exp < currentTime) {
      const response = await axios.get("http://localhost:5000/token", {
        withCredentials: true,
      });
      const newToken = response.data[0].payload.accessToken;
      setAuthToken(newToken);
      config.headers.Authorization = `Bearer ${newToken}`;
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosToken;
