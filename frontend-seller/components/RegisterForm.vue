<template>
  <form class="RegisterForm" @submit.prevent="register">
    <ToastComp ref="toastRef" />

    <InputEmail class="RegisterForm-email" v-model="email" :focus="true" @valid="onValidEmail" />

    <InputUsername class="RegisterForm-username" v-model="username" label="username" placeholder="e.g. Name777"
      :minLength="5" :maxLength="20" @valid="onValidUsername" />

    <InputPassword class="RegisterForm-password" v-model="password" @valid="onValidPassword" />

    <InputSelect class="RegisterForm-country" v-model="country" label="Country" 
      :options="countries" @valid="onValidCountry" required>
      <template #option="{ option }">
        <span class="flex">
          <img :src="`/flags/${option.code?.toLowerCase()}.svg`" alt="" class="flag" />
          <span style="margin-left: 0.5rem; "> {{ option.label }}</span>
        </span>
      </template>
    </InputSelect>

    <InputCheck class="RegisterForm-terms" v-model="terms" @valid="onValidTerms" label="I have read the "
      :link="{ label: 'terms of use and privacy policy.', href: '/terms' }" required />


    <ButtonSolid class="RegisterForm-button" type="submit" label="Register" :disabled="disableSubmit"
      :loading="auth.loading" />
  </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const router = useRouter();

const toastRef = ref(null);

const displayMessage = (message, type, duration) => {
  toastRef.value?.showToast(message, type, duration)
}

const countries = ref([{ label: 'United States', code: 'US' }])

const email = ref('')
const username = ref('')
const password = ref('')
const country = ref('')
const terms = ref(false)

const emailValid = ref(false)
const usernameValid = ref(false)
const passwordValid = ref(false)
const countryValid = ref(false)
const termsValid = ref(false)

const onValidEmail = (event) => {
  console.log("emailhandler", event)
  emailValid.value = event
}

const onValidUsername = (event) => {
  console.log("onValidUsername", event)
  usernameValid.value = event
}

const onValidPassword = (event) => {
  console.log("passwordhandler", event)
  passwordValid.value = event
}

const onValidCountry = (event) => {
  console.log("countryHandler", event)
  countryValid.value = event
}

const onValidTerms = (event) => {
  console.log("termshandler", event)
  termsValid.value = event
}

const disableSubmit = computed(() => !emailValid.value || !usernameValid.value || !passwordValid.value || !termsValid.value || !countryValid.value)


const register = async () => {
  try {
    //console.log('Credentials', { email: email.value, username: username.value, password: password.value, terms_accepted: terms.value, country: country.value })

    const response = await auth.register({ email: email.value, username: username.value, password: password.value, terms_accepted: terms.value, country: country.value })

    displayMessage(response.data.message, 'success', 20_000)

    router.replace({ path: '/entry', query: { m: 'email' } })
  } catch (err) {
    console.error(err)
    displayMessage(err, 'error', 20_000)
  }
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
}

.RegisterForm-email,
.RegisterForm-username,
.RegisterForm-password,
.RegisterForm-country {
  margin-bottom: 1rem;
}
</style>