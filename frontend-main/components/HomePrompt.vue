<template>
    <div class="HomePrompt flex center">
        <form class="HomePrompt-form" @submit.prevent="submitPrompt">
            <div class="input-wrapper flex">
                <textarea v-model="prompt" aria-label="Prompt" @keydown.enter.exact.prevent="submitPrompt"
                    class="chat-input" rows="1" @focus="onFocusOrClick" @click="onFocusOrClick"></textarea>
                <span class="ghost-placeholder" v-if="placeholderVisible && !prompt">
                    {{ typedPlaceholder }}
                </span>
            </div>
            <button class="send-button flex center" type="submit" :disabled="isSubmitting || !prompt.trim()"
                title="Enviar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-arrow-up-icon lucide-arrow-up">
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                </svg>
            </button>
        </form>
    </div>
</template>

<script setup>

const router = useRouter()
const auth = useAuthStore()

const prompt = ref('')
const isSubmitting = ref(false)
const placeholderVisible = ref(true)
const animationActive = ref(true)

const suggestions = [
    "I want to buy some comfortable sneakers.",
    "I'm looking for a lightweight laptop to work from home.",
    'Type your prompt here.'
]

const typedPlaceholder = ref('')
let typingTimer = null
let rotateTimer = null
let index = 0
let charIndex = 0

function typeText() {
    if (!animationActive.value) return

    const currentText = suggestions[index]
    if (charIndex < currentText.length) {
        typedPlaceholder.value += currentText[charIndex++]
        typingTimer = setTimeout(typeText, 30)
    } else {
        rotateTimer = setTimeout(() => {
            index = (index + 1) % suggestions.length
            charIndex = 0
            typedPlaceholder.value = ''
            typeText()
        }, 5000)
    }
}

function stopTyping() {
    clearTimeout(typingTimer)
    clearTimeout(rotateTimer)
}

function lockAndStopTyping() {
    stopTyping()
    animationActive.value = false
    placeholderVisible.value = false
}

function submitPrompt() {
    const trimmed = prompt.value.trim()
    if (!trimmed) return

    isSubmitting.value = true

    router.push({
        name: 'country-s',
        params: { country: auth.country },
        query: {
            prompt: trimmed,
            vectorized: true
        }
    })

    setTimeout(() => {
        prompt.value = ''
        isSubmitting.value = false
    }, 1000)
}

function onFocusOrClick() {
    if (animationActive.value) {
        lockAndStopTyping()
    }
}

onMounted(() => {
    typeText()
})

onBeforeUnmount(() => {
    stopTyping()
})
</script>
<style scoped>
.HomePrompt {
    width: 100%;
    box-sizing: border-box;
}

.HomePrompt-form {
    width: inherit;
    display: flex;
    padding: 1rem;
    overflow: hidden;
    margin-top: 1rem;
    position: relative;
    align-items: center;
    box-sizing: border-box;
    background: transparent;
    border-radius: var(--radius-d);
    transition: var(--transition-a);
    max-width: 600px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-a);
}

.HomePrompt-form:hover {
    border: 1px solid var(--border-b);
}

.input-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.chat-input {
    z-index: 2;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    height: 4rem;
    line-height: 2rem;
    position: relative;
    color: var(--text-a);
    background: transparent;
    font-size: var(--text-size-2);
}


.ghost-placeholder {
    top: 6px;
    left: 8px;
    z-index: 1;
    opacity: 0.6;
    position: absolute;
    white-space: normal;
    padding-right: 1rem;
    pointer-events: none;
    color: var(--text-b);
    font-size: var(--text-size-2);
}

.send-button {
    background-color: black;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.send-button:hover {
    background-color: #333;
}

.send-button:disabled {
    background-color: #888;
    cursor: not-allowed;
}
</style>

<style scoped>
@media (max-width: 480px) {

    .HomePrompt {
        padding: 1rem;
    }

    .HomePrompt-form {
        margin: 0rem;
    }

    .ghost-placeholder {
        font-size: var(--text-size-1);
    }
}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>