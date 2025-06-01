<template>
    <div class="AuthView">
        <ToastComp ref="toastRef" />
        <p class="title">
            Login Wallet
        </p>

        <div class="AuthView-wallets">
            <button class="AuthView-wallet" v-for="item in walletIcons" :key="item.name" type="submit"
                @click="connectWallet(item.name)">

                <img :src="item.src" :alt="item.name" />

                <span>{{ item.name }} </span>
            </button>

            <span class="terms">
                By logging in with your wallet you accept the usage policy of the dapp and understand the CIP-30
                standard.
            </span>
        </div>

    </div>
</template>

<script setup>
import eternl from '@/assets/icon/eternl.png'
import lace from '@/assets/icon/lace.svg'
import nami from '@/assets/icon/nami.svg'

const config = useRuntimeConfig()

const toastRef = ref(null);
const displayMessage = (message, type, duration) => {
    toastRef.value?.showToast(message, type, duration)
}

const auth = useAuthStore()
const wallet = useWalletStore()

const walletMap = {
    eternl,
    lace,
    nami
}

const validWallets = config.public.validWallets

const walletIcons = validWallets.map(name => ({
    name,
    src: walletMap[name] ?? ''
}))

const connectWallet = async (name) => {
    try {
        await wallet.connect(name)

        const [signature, address] = await wallet.sign()

        await auth.login({
            signature,
            address,
            wallet_name: "lace",
            country: "US",
            terms_accepted: true
        })

        auth.authDrawer = false
    } catch (err) {
        console.error(err);

        displayMessage(err, 'error', 20_000)

    }
}
</script>

<style lang="css" scoped>
.AuthView {
    padding: 1.25rem;
}

.AuthView-wallets {
    display: flex;
    flex-direction: column;
}

.AuthView-wallet {
    padding: 1rem;
    display: flex;
    cursor: pointer;
    margin-top: 1rem;
    align-items: center;
    background: transparent;
    border-radius: var(--radius-b);
    transition: var(--transition-a);
    border: 1px solid var(--border-a);
}

.AuthView-wallet:hover {
    border: 1px solid var(--primary-a);
}

.AuthView-wallet img {
    width: 1.5rem;
}

.AuthView-wallet span {
    font-size: var(--text-size-1);
    text-transform: capitalize;
    margin-left: 1rem;
    font-weight: 600;
}

.title {
    font-size: var(--text-size-3);
    font-weight: 700;
}

.terms {
    font-size: var(--text-size-0);
    color: var(--text-b);
    text-align: center;
    margin-top: 1rem;
    font-weight: 300;
}
</style>