<template>
  <div class="country-selector">
    <div class="title">
      <span>Choose your country or region</span>
    </div>
    <div class="subtitle">
      <span>Select your country or region to continue. DAO governance will eventually enable more countries.</span>
    </div>
    <div class="button-group">
      <button class="country-button" @click="selectCountry('us')">
        <span class="flag">
          <img :src="US" alt="">
        </span>
        <div class="country-info">
          <div class="country-name">United States</div>
          <div class="language">English</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import US from '@pairfy/common-f/public/us.svg';

const auth = useAuthStore()

const route = useRoute()
const router = useRouter()

const selectCountry = (code) => {
  auth.setLocation(code)

  router.replace({
    name: 'country',
    params: { country: code },
    query: { ...route.query }
  })
};
</script>

<style scoped>
.country-selector {
  max-width: 500px;
  padding: 1.5rem;
  margin: auto;
}

.button-group {
  gap: 1rem;
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.country-button {
  gap: 1rem;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-radius: var(--radius-b);
  background: var(--background-a);
  border: 1px solid var(--border-b);
}

.country-button:hover {
  background: var(--background-b);
}

.country-info {
  text-align: left;
}

.country-name {
  font-size: var(--text-size-1);
  font-weight: 700;
}

.language {
  font-size: var(--text-size-0);
  color: var(--text-b);
}

.title {
  font-size: var(--text-size-4);
  font-weight: 700;
}

.subtitle {
  font-size: var(--text-size-1);
  line-height: 1.25rem;
  color: var(--text-b);
  margin: 1rem 0;
}

.language {
  margin-top: 0.25rem;
}
</style>