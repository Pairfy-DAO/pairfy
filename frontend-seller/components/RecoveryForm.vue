<template>
  <form class="RecoveryForm" @submit.prevent="login">
    <ToastComp ref="toastRef" />

    <InputEmail class="RecoveryForm-email" v-model="email" :focus="true" @valid="onValidEmail" />

    <ButtonSolid class="RegisterForm-button" type="submit" label="Recovery" :disabled="disableSubmit" />
  </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const emailValid = ref(false)

const disableSubmit = ref(false)

const login = () => {
  console.log('Logging in', email.value, password.value)
}

const onValidEmail = (event) => {
  emailValid.value = event
}
</script>

<style scoped>
form{
  display: flex;
  flex-direction: column;
}

.RegisterForm-button{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>