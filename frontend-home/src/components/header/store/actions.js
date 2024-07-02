import axiosAPI from "@/api/axios-api";

const currentSeller = async ({ commit }) => {
  try {
    const response = await axiosAPI.get("/api/seller/current-seller");

    console.log(response.data);

    commit("currentSeller", response.data.sellerData);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { success: false, response: error.response.data };
  }
};

const loginSeller = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/seller/login-seller", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const setupWallet = async ({ commit }, params) => {
  commit("setupWallet", params);
};

const connectWallet = async ({ commit }, params) => {
  console.log(params);
  commit("connectWallet", params);
};
export { connectWallet, currentSeller, loginSeller, setupWallet };
