<!-- pages/login.vue -->
<template>
  <div class="entry">

    <div class="entry-form">

      <div class="entry-form-image">
        <NuxtLink :to="{ path: '/entry', query: { m: 'login' } }">
          <img :src="miImagen" alt="Mi imagen" />
        </NuxtLink>
      </div>


      <div class="entry-form-content">

        <component :is="currentComponent" />

        <div class="entry-form-switcher" v-if="!['verify','email'].includes(currentView)">

          <NuxtLink v-if="!['login'].includes(currentView)" :to="{ path: '/entry', query: { m: 'login' } }">
            <button @click="mode = 'login'">I already have an account</button>
          </NuxtLink>
          <NuxtLink v-if="!['register'].includes(currentView)" :to="{ path: '/entry', query: { m: 'register' } }">
            <button @click="mode = 'register'">Create a new account</button>
          </NuxtLink>
          <NuxtLink :to="{ path: '/entry', query: { m: 'recovery' } }">
            <button @click="mode = 'recovery'">Recover password</button>
          </NuxtLink>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import miImagen from '@/assets/brand/icon.svg'
import RegisterForm from '~/components/RegisterForm.vue'
import LoginForm from '~/components/LoginForm.vue'
import VerifyView from '~/components/VerifyView.vue'
import RecoveryForm from '~/components/RecoveryForm.vue'
import EmailView from '~/components/EmailView.vue'


definePageMeta({
  layout: 'entry'
})

const mode = ref('login')

const views = {
  login: LoginForm,
  register: RegisterForm,
  recovery: RecoveryForm,
  verify: VerifyView,
  email: EmailView 
}

const route = useRoute()

const currentView = computed(() => {
  const m = route.query.m?.toString() || 'login'
  return m in views ? m : 'login'
})

const currentComponent = computed(() => views[currentView.value])


</script>

<style scoped>
.entry {
  justify-content: center;
  align-items: flex-start;
  display: flex;
  height: 100%;
}

.entry-form {
  background: var(--background-a);
  border-radius: var(--radius-c);
  box-shadow: var(--shadow-a);
  margin-top: 10rem;
  padding: 1.5rem;
  width: 300px;
}

.entry-form-image {
  justify-content: center;
  display: flex;
  padding: 1rem;
}

.entry-form-image img {
  width: 8rem;
}

.entry-form-content {
  flex-direction: column;
  display: flex;
}

.entry-form-switcher {
  flex-direction: column;
  display: flex;
  align-items: flex-start;
}

.entry-form-switcher button {
  background: transparent;
  color: var(--primary-a);
  margin-bottom: 0.5rem;
  cursor: pointer;
  border: none;
}
</style>