<template>
  <form class="RegisterForm" @submit.prevent="register">
    <ToastComp ref="toastRef" />

    <InputEmail class="RegisterForm-email" v-model="email" :focus="true" @valid="emailValid = $event" />

    <InputUsername class="RegisterForm-username" v-model="username" label="username" :minLength="5" :maxLength="20"
      @valid="usernameValid = $event" />

    <InputPassword class="RegisterForm-password" v-model="password" @valid="passwordValid = $event" />

    <InputSelect class="RegisterForm-country" v-model="country" label="Country" :options="countries"
      @valid="countryValid = $event" required small>
      <template #selected="{ option }">
        <span class="flex">
          <img class="flag" :src="`/flags/${option.code?.toLowerCase()}.svg`" alt="" />
          <span style="margin-left: 0.5rem; "> {{ option.label }}</span>
        </span>
      </template>

      <template #option="{ option }">
        <span class="flex">
          <img class="big-flag" :src="`/flags/${option.code?.toLowerCase()}.svg`" alt="" />
          <span style="margin-left: 0.5rem; "> {{ option.label }}</span>
        </span>
      </template>
    </InputSelect>

    <InputCheck class="RegisterForm-terms" v-model="terms" @valid="termsValid = $event" label="I have read the "
      :link="{ label: 'terms of use.', href: '/terms' }" required />


    <ButtonSolid class="RegisterForm-button" type="submit" label="Register" :disabled="disableSubmit"
      :loading="auth.loading" />
  </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { sleep } from '@/utils/utils'

const auth = useAuthStore()

const router = useRouter();

const toastRef = ref(null);

const countries = ref([{ label: 'United States', code: 'US' }])

const email = ref('')
const username = ref('')
const password = ref('')
const country = ref('')
const terms = ref(false)

const emailValid = ref(false)
const usernameValid = ref(false)
const passwordValid = ref(false)
const termsValid = ref(false)
const countryValid = ref(false)

const disableSubmit = computed(() => !emailValid.value || !usernameValid.value || !passwordValid.value || !termsValid.value || !countryValid.value)

const register = async () => {
  try {

    const registerParams = {
      email: email.value,
      username: username.value,
      password: password.value,
      country: country.value,
      terms_accepted: terms.value
    }
    
    const response = await auth.register(registerParams)

    displayMessage(response.message, 'success', 20_000)

    await sleep(1_000)

    router.replace({ path: '/entry', query: { m: 'email' } })
  } catch (err) {
    console.error(err)
    displayMessage(err, 'error', 20_000)
  }
}

function displayMessage (message, type, duration) {
  toastRef.value?.showToast(message, type, duration)
}

</script>

<style scoped>
form {
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
  display: flex;
}

.RegisterForm-button {
  margin-bottom: 1rem;
}

.RegisterForm-terms {
  font-family: var(--text-size-0);
  color: var(--text-b);
  margin-bottom: 1rem;
  font-weight: 300;
}

.RegisterForm-email,
.RegisterForm-username,
.RegisterForm-password,
.RegisterForm-country {
  margin-bottom: 1rem;
}

.flag {
  width: 1rem;
}

.big-flag {
  width: 1.5rem;
}
</style>