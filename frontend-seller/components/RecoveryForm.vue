<template>
  <form class="RecoveryForm" @submit.prevent="recovery">
    <ToastComp ref="toastRef" />

    <template v-if="!withToken">

      <InputEmail class="RecoveryForm-email" v-model="email" :focus="true" @valid="emailValid = $event" />
      <ButtonSolid class="RegisterForm-button" type="submit" label="Recovery" :disabled="disableRecoveryButton"
        :loading="auth.loading" />

    </template>

    <template v-if="withToken">

      <InputPassword class="RegisterForm-password" v-model="password1" @valid="password1Valid = $event" style="margin-top: 0rem;"/>
      <InputPassword class="RegisterForm-password" v-model="password2" @valid="password2Valid = $event"
        label="Repeat password" />
        
      <ButtonSolid class="RegisterForm-button" type="submit" label="Update password" :disabled="disableUpdateButton"
        :loading="auth.loading" />

    </template>

  </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { sleep } from '@/utils/utils'

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const toastRef = ref(null);

const withToken = computed(() => route.query?.t)

const email = ref('')
const emailValid = ref(false)

const disableRecoveryButton = computed(() => !emailValid.value)

const password1 = ref(null);
const password2 = ref(null);

const password1Valid = ref(false);
const password2Valid = ref(false);

const disableUpdateButton = computed(() => !password1Valid.value || !password2Valid.value)

const recovery = async () => {
  try {
    if (withToken.value) {
      await updatePassword()
      return
    }

    const response = await auth.recovery({ email: email.value })

    displayMessage(response.message, 'success', 20_000)

    router.replace({ path: '/entry', query: { m: 'email' } })

  } catch (err) {
    console.error(err)

    displayMessage(err, 'error', 20_000)
  }
}


const updatePassword = async () => {
  try {
    if(password1.value.trim() !== password2.value.trim()){
      throw new Error('The passwords do not match.')
    }

    const response = await auth.updatePassword({ token: withToken.value, password: password2.value })

    displayMessage(response.message, 'success', 20_000)

    await sleep(3_000)

    router.replace({ path: '/entry', query: { m: 'login' } })

  } catch (err) {
    console.error(err)

    displayMessage(err, 'error', 20_000)
  }
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

.RegisterForm-password {
  margin-top: 1rem
}
</style>