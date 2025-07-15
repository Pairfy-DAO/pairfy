<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup>

const appConfig = useAppConfig()

useHead({
  title: appConfig.title,
  meta: [
    { name: 'description', content: 'A cool Nuxt 3 app' },
    { property: 'og:title', content: 'Nuxt App' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap' }
  ]
})

</script>


