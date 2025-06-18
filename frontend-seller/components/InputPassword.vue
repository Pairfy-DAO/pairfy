<template>
    <div class="InputPassword">
        <label class="title-text">{{ label }}</label>
        <div class="InputPassword-wrap">
            <input ref="inputRef" :type="isVisible ? 'text' : 'password'" :value="modelValue" @input="onInput"
                placeholder="Enter your password" class="InputPassword-input"
                :class="{ 'is-invalid': errorMessage }" />

            <button class="toggle-btn" type="button" @click="toggleVisibility">


                <svg v-if="!isVisible" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-eye-icon lucide-eye">
                    <path
                        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                </svg>

                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-eye-closed-icon lucide-eye-closed">
                    <path d="m15 18-.722-3.25" />
                    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                    <path d="m20 15-1.726-2.05" />
                    <path d="m4 15 1.726-2.05" />
                    <path d="m9 18 .722-3.25" />
                </svg>
            </button>
        </div>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    focus: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: 'Password'
    }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const inputRef = ref(null)
const isVisible = ref(false)
const errorMessage = ref('')


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/

onMounted(() => {
    if (props.focus) {
        inputRef.value?.focus()
    }
})

watch(() => props.focus, (newVal) => {
    if (newVal) {
        inputRef.value?.focus()
    }
})

const toggleVisibility = () => {
    isVisible.value = !isVisible.value
}

const onInput = (e) => {
    const value = e.target.value
    emit('update:modelValue', value)
    validatePassword(value)
}

const validatePassword = (password) => {
    if (!password) {
        errorMessage.value = 'Password is required.'
        emit('valid', false)
        return false
    } else if (password.length < 8) {
        errorMessage.value = 'Password must be at least 8 characters.'
        emit('valid', false)
        return false
    } else if (password.length > 64) {
        errorMessage.value = 'Password must be no more than 64 characters.'
        emit('valid', false)
        return false
    } else if (!passwordRegex.test(password)) {
        errorMessage.value = 'Password must include uppercase, lowercase, number, and symbol.'
        emit('valid', false)
        return false
    }

    errorMessage.value = ''
    emit('valid', true)
    return true
}


</script>

<style scoped>
.InputPassword {
    display: flex;
    flex-direction: column;
    max-width: 300px;
}

.InputPassword-wrap {
    position: relative;
}

.InputPassword-input {
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border-radius: var(--input-radius);
    border: 1px solid var(--border-a);
    background: var(--background-b);
    box-sizing: border-box;
    outline: none;
    width: 100%;
}

input::placeholder {
  opacity: var(--placeholder-opacity);
  color: var(--text-b);
}

.InputPassword-input:focus-within {
    border: 1px solid var(--primary-a);
}

.InputPassword-input.is-invalid {
    border-color: red;
}

.toggle-btn {
    transform: translateY(-50%);
    background: transparent;
    align-items: center;
    position: absolute;
    display: flex;
    top: 50%;
    border: none;
    right: 0.75rem;
    font-size: 1.1rem;
    cursor: pointer;
}

.title-text {
    font-size: var(--text-size-0);
    margin-bottom: 0.75rem;
    font-weight: 600;
}

.error-text {
    font-size: var(--text-size-0);
    margin: 0.5rem 0;
    color: red;
}
</style>