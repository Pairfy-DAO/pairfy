// https://nuxt.com/docs/api/configuration/nuxt-config

import wasm from "vite-plugin-wasm";

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    serviceUserBase: process.env.NUXT_SERVICE_USER_BASE,
    serviceQueryBase: process.env.NUXT_SERVICE_QUERY_BASE,
    serviceMediaBase: process.env.NUXT_SERVICE_MEDIA_BASE,
    public: {
      apiBaseBrowser: "",
      validWallets: ["lace", "nami", "eternl"],
      mediaCDNBase: process.env.NUXT_PUBLIC_MEDIA_CDN,
    },
  },
  css: [
    "~/assets/css/main.css", // global CSS
  ],
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [wasm()],
    build: {
      target: "esnext",
    },
    server: {
      allowedHosts: [
        //"c719-2800-e2-bb80-5ef-a58c-fcd2-4177-1bfc.ngrok-free.app",
      ],
    },
  },
});
