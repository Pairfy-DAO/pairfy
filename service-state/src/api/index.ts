import axios from "axios";

axios.defaults.withCredentials = true;

export const blockFrostAPI = axios.create({
  baseURL: "https://cardano-preprod.blockfrost.io/api/v0",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Project_id: process.env.PROJECT_ID,
  },
});

export { axios };
