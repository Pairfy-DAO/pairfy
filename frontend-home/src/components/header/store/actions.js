import axiosAPI from "@/api/axios-api";

const currentSeller = async ({ commit }) => {
  try {
    const response = await axiosAPI.get("/api/seller/current-seller");

    commit("currentSeller", response.data.sellerData);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { success: false, response: error.response.data };
  }
};

const loginSeller = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post("/api/seller/login-seller", params);

    commit("currentSeller", response.data.data);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const logoutSeller = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get("/api/seller/logout", params);

    commit("currentSeller", null);

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


const startTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gate/start-tx", params);

    console.log(response);

    //commit("createProduct", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const setupLucid = async ({ commit }, data) => {
  commit("setupLucid", data);
};


export { connectWallet, setupLucid, startTx, currentSeller, loginSeller, setupWallet, logoutSeller };
