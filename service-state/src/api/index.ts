import axios from "axios";
import axiosRetry from "axios-retry";

axios.defaults.withCredentials = true;

export const blockFrostAPI = axios.create({
  baseURL: process.env.BLOCKFROST_HOST,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Project_id: process.env.BLOCKFROST_KEY,
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
