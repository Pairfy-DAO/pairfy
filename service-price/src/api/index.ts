import axios from "axios";

//axios.defaults.withCredentials = true;

export const axiosAPI = axios.create({
  baseURL: "https://api.binance.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  //  "Access-Control-Allow-Credentials": true,
  },
});

