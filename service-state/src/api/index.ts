import axios from "axios";
import axiosRetry from "axios-retry";

axios.defaults.withCredentials = true;

export const blockFrostAPI = axios.create({
  baseURL: "https://cardano-preprod.blockfrost.io/api/v0",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Project_id: process.env.PROJECT_ID,
  },
});

axiosRetry(blockFrostAPI, {
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      error.code === "EAI_AGAIN" ||
      axiosRetry.isRetryableError(error)
    );
  },
});

export { axios };
