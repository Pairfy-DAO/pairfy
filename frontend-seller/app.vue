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
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap' }
  ]
})

</script>


