<template>
  <form class="LoginForm" @submit.prevent="connectWallet">
    <ToastComp ref="toastRef" />

    <InputEmail class="LoginForm" v-model="email" :focus="true" @valid="onValidEmail" />

    <InputPassword class="LoginForm-password" v-model="password" @valid="onValidPassword" />

    <div class="LoginForm-wallets">
      <button class="LoginForm-wallet" :class="{ disabled: disableSubmit }" type="submit" v-for="item in walletImages"
        :key="item.name" @click="connectWallet(item.name)">
        <img :src="item.src" :alt="item.name" />
      </button>

      <div class="LoginForm-wallet" :class="{ disabled: disableSubmit }" />
      <div class="LoginForm-wallet" :class="{ disabled: disableSubmit }" />

    </div>

  </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { useWalletStore } from '@/stores/wallet'
import eternl from '@/assets/icon/eternl.png'
import lace from '@/assets/icon/lace.svg'
import nami from '@/assets/icon/nami.svg'

const config = useRuntimeConfig()

const auth = useAuthStore()

const router = useRouter()

const wallet = useWalletStore()

const toastRef = ref(null);

const displayMessage = (message, type, duration) => {
  toastRef.value?.showToast(message, type, duration)
}

const walletMap = {
  eternl,
  lace,
  nami
}

const validWallets = config.public.validWallets

const walletImages = validWallets.map(name => ({
  name,
  src: walletMap[name] ?? ''
}))


const email = ref('')
const password = ref('')

const emailValid = ref(false)
const passwordValid = ref(false)

const onValidEmail = (event) => {
  emailValid.value = event
}

const onValidPassword = (event) => {
  passwordValid.value = event
}

const disableSubmit = computed(() => {
  return !emailValid.value || !passwordValid.value
})

const connectWallet = async (name) => {
  try {
    await wallet.connect(name)

    const [signature, address] = await wallet.sign()

    await auth.login({
      email: email.value,
      password: password.value,
      wallet_name: name,
      signature,
      address
    })

    router.push({ path: '/home', query: {} })
  } catch (err) {
    console.error(err);
    displayMessage(err.message, 'error', 20_000)

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

.LoginForm-wallets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3rem, 1fr));
  gap: 8px;
  justify-content: center;
  margin-bottom: 1rem;
}

.LoginForm-wallet {
  width: 3rem;
  height: 3rem;
  display: flex;
  cursor: pointer;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: var(--radius-b);
  border: 1px solid var(--border-a);
}

.LoginForm-wallet.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.LoginForm-wallet img {
  width: 1.25rem;
}

.LoginForm,
.LoginForm-password {
  margin-bottom: 1rem;
}
</style>