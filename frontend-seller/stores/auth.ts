export const useAuthStore = defineStore("auth", () => {
  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  const toastMessage = ref<ToastMessage | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const seller = useState<any>("seller", () => null);
  const isAuthenticated = useState<boolean>("isAuthenticated", () => false);
  const walletName = ref<string | null>(null);

  const showToast = (message: string, type: ToastType, duration: number) => {
    if (!import.meta.client) return;

    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  const login = async (params: {
    email: string;
    password: string;
    wallet_name: string;
    signature: string;
    address: string;
  }) => {
    if (!import.meta.client) return;

    loading.value = true;

    try {
      await $fetch("/api/seller/login-seller", {
        method: "POST",
        body: params,
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });
      await fetchUser();
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    if (!import.meta.client) return;

    try {
      const response: any = await $fetch("/api/seller/current-seller", {
        method: "GET",
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });
      const sellerData = response.data;

      if (sellerData) {
        seller.value = sellerData;
        walletName.value = sellerData.wallet_name;
        isAuthenticated.value = true;
      }

      return sellerData;
    } catch (err: any) {
      console.error(err);

      showToast(err.message, "error", 10_000);
      isAuthenticated.value = false;
      seller.value = null;
    }
  };

  const logout = async () => {
    if (!import.meta.client) return;

    try {
      await $fetch("/api/seller/logout-seller", {
        method: "GET",
        credentials: "include",
      });
    } catch (err: any) {
      throw err;
    } finally {
      isAuthenticated.value = false;
      seller.value = null;
    }
  };

  const recovery = async (credentials: { email: string }) => {
    if (!import.meta.client) return;

    loading.value = true;

    try {
      const response = await $fetch("/api/seller/recovery-seller", {
        method: "POST",
        body: credentials,
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      return response;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (credentials: {
    email: string;
    username: string;
    password: string;
    country: string;
    terms_accepted: boolean;
  }) => {
    if (!import.meta.client) return;

    loading.value = true;

    try {
      const response: any = await $fetch("/api/seller/create-seller", {
        method: "POST",
        body: credentials,
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      return response;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (credentials: {
    token: string;
    password: string;
  }) => {
    if (!import.meta.client) return;

    loading.value = true;

    try {
      const response: any = await $fetch("/api/seller/update-password", {
        method: "POST",
        body: credentials,
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      return response;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const verify = async (body: { token: string }) => {

    if (!import.meta.client) return;

    loading.value = true;

    try {
      const response = await $fetch("/api/seller/verify-seller", {
        method: "POST",
        body: body,
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      return response;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    isAuthenticated,
    seller,
    loading,
    error,
    login,
    register,
    logout,
    verify,
    recovery,
    fetchUser,
    updatePassword,
    showToast,
    walletName
  };
});
