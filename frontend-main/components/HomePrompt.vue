<template>
    <div class="HomeChat flex center">
        <form class="chat-form" @submit.prevent="submitPrompt">
            <div class="input-wrapper flex">
                <textarea v-model="prompt" aria-label="Prompt" @keydown.enter.exact.prevent="submitPrompt"
                    class="chat-input" rows="1" @focus="onFocusOrClick" @click="onFocusOrClick"></textarea>
                <span class="ghost-placeholder" v-if="placeholderVisible && !prompt">
                    {{ typedPlaceholder }}
                </span>
            </div>
            <button class="send-button flex center" type="submit" :disabled="isSubmitting || !prompt.trim()" title="Enviar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-icon lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
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
    "I want to buy some comfortable sneakers for walking long distances, that aren't too expensive.",
    "I'm looking for a lightweight laptop to work from home, with a good battery life, and that isn't too expensive.",
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
        }, 2000)
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
.HomeChat {
    width: 100%;
    box-sizing: border-box;
}

.chat-form {
    width: inherit;
    display: flex;
    align-items: center;
    padding: 1rem;
    margin: 20px auto;
    margin-top: 4rem;
    position: relative;
    box-sizing: border-box;
    background: transparent;
    border-radius: var(--radius-d);
    transition: var(--transition-a);
    max-width: calc(var(--body-a) - 20rem);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 80%);
}

.chat-form:hover{
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #888;
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
    color: var(--text-w);
    background: transparent;
    font-size: var(--text-size-2);
}


.ghost-placeholder {
    position: absolute;
    top: 6px;
    left: 8px;
    color: rgba(255, 255, 255, 90%);
    font-size: var(--text-size-2);
    pointer-events: none;
    white-space: nowrap;
    z-index: 1;
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