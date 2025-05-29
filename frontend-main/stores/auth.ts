export const useAuthStore = defineStore("user", () => {
  const isAuthenticated = useState<boolean>("isAuthenticated", () => false);
  const user = useState<any>("user", () => null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const login = async (credentials: {
    signature: string;
    address: string;
  }) => {
    loading.value = true;

    try {
      await $fetch("/api/user/login-user", {
        method: "POST",
        body: credentials,
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });
      
      //await fetchProfile();
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      loading.value = false;
    }
  };

  const register = async (credentials: {
    email: string;
    password: string;
    terms_accepted: boolean;
  }) => {
    loading.value = true;

    try {
      const response: any = await $fetch("/api/user/create-user", {
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
      const data = await $fetch("/api/user/current-user", {
        method: "GET",
        credentials: "include",
      });

      user.value = data;
      isAuthenticated.value = true;
    } catch (err: any) {
      isAuthenticated.value = false;
      user.value = null;
    }
  };

  const verify = async (body: { token: string }) => {
    loading.value = true;

    try {
      const response = await $fetch("/api/user/verify-user", {
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
      await $fetch("/api/user/logout-user", {
        method: "GET",
        credentials: "include",
      });
    } catch {}

    isAuthenticated.value = false;
    user.value = null;
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    verify,
    fetchProfile,
  };
});
