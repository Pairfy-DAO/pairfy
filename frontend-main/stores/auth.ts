export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);
  const isAuthenticated = ref(false);

  const authDrawer = ref(false);
  const userDrawer = ref(false);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (params: {
    signature: string;
    address: string;
    wallet_name: string;
    country: string;
    terms_accepted: boolean;
  }) => {
    if (import.meta.server) return;

    loading.value = true;

    try {
      await $fetch("/api/user/login-user", {
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
    if (import.meta.server) return;

    try {
      const response: any = await $fetch("/api/user/current-user", {
        method: "GET",
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      const userData = response.userData;

      if (user) {
        user.value = userData;
        isAuthenticated.value = true;
      }
    } catch (err: any) {
      console.error(err);

      isAuthenticated.value = false;
      user.value = null;
    }
  };

  const logout = async () => {
    if (import.meta.server) return;

    try {
      await $fetch("/api/user/logout-user", {
        method: "GET",
        credentials: "include",
      });

      userDrawer.value = false;
    } catch (err: any) {
      throw err;
    } finally {
      isAuthenticated.value = false;
      user.value = null;
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    fetchUser,
    authDrawer,
    userDrawer,
  };
});
