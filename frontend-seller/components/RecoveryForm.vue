<template>
  <form class="RecoveryForm" @submit.prevent="recovery">
    <ToastComp ref="toastRef" />

    <InputEmail class="RecoveryForm-email" v-model="email" :focus="true" @valid="onValidEmail" />

    <ButtonSolid class="RegisterForm-button" type="submit" label="Recovery" :disabled="disableSubmit"
      :loading="auth.loading" />
  </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore();
const router = useRouter();

const toastRef = ref(null);

const email = ref('')
const emailValid = ref(false)

const disableSubmit = computed(() => !emailValid.value)

const recovery = async () => {
  try {
    const response = await auth.recovery({ email: email.value })

    displayMessage(response.message, 'success', 20_000)

    router.replace({ path: '/entry', query: { m: 'email' } })

  } catch (err) {
    console.error(err)

    displayMessage(err, 'error', 20_000)
  }
}

const onValidEmail = (event) => {
  emailValid.value = event
}

function displayMessage(message, type, duration) {
  toastRef.value?.showToast(message, type, duration)
}

</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.RegisterForm-button {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>