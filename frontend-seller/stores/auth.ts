export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = useState<boolean>("isAuthenticated", () => false);
  const seller = useState<any>("seller", () => null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: {
    email: string;
    password: string;
    wallet_name: string,
    signature: string;
    address: string;
  }) => {
    loading.value = true;

    try {
      await $fetch("/api/seller/login-seller", {
        method: "POST",
        body: credentials,
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });
      await fetchProfile();
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      loading.value = false;
    }
  };

  const recovery = async (credentials: { email: string }) => {
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
      throw new Error(err.message);
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
      throw new Error(err.message);
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (credentials: {
    token: string;
    password: string;
  }) => {
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
      throw new Error(err.message);
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    if (!import.meta.server) return;

    try {
      const data = await $fetch("/api/seller/current-seller", {
        method: "GET",
        credentials: "include",
      });

      seller.value = data;
      isAuthenticated.value = true;
    } catch (err: any) {
      isAuthenticated.value = false;
      seller.value = null;
    }
  };

  const verify = async (body: { token: string }) => {
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
      throw new Error(err.message);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/seller/logout-seller", {
        method: "GET",
        credentials: "include",
      });
    } catch {}

    isAuthenticated.value = false;
    seller.value = null;
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
    fetchProfile,
    updatePassword,
  };
});
