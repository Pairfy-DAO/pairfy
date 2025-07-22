// https://nuxt.com/docs/api/configuration/nuxt-config

import wasm from "vite-plugin-wasm";

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    serviceSellerBase: process.env.NUXT_SERVICE_SELLER_BASE,
    serviceProductBase: process.env.NUXT_SERVICE_PRODUCT_BASE,
    serviceLlmBase: process.env.NUXT_SERVICE_LLM_BASE,
    serviceMediaBase: process.env.NUXT_SERVICE_MEDIA_BASE,
    serviceGatewayBase: process.env.NUXT_SERVICE_GATEWAY_BASE,
    serviceNotificationBase: process.env.NUXT_SERVICE_NOTIFICATION_BASE,
    serviceChatBase: process.env.NUXT_SERVICE_CHAT_BASE,
    redisChatBase: process.env.NUXT_REDIS_CHAT_BASE,
    public: {
      apiBaseBrowser: "",
      validWallets: ["lace", "nami", "eternl"],
      mediaCDNBase: process.env.NUXT_PUBLIC_MEDIA_CDN, //build-arg actions secret
      cardanoNetwork: process.env.NUXT_PUBLIC_CARDANO_NETWORK,
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
  },
});
