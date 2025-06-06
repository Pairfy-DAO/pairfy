<template>
    <div class="SearchPrompt flex center">

        <DrawerComp v-model="filterDrawer" position="left" width="350px" :overlay="false">
            <SearchPanel @onApply="filterDrawer = false" />
        </DrawerComp>

        <form class="SearchPrompt-form" :class="{ 'focused': isFocused }" @focusin="isFocused = true"
            @focusout="isFocused = false" @submit.prevent="submitPrompt">
            <div class="controls">
                <div class="SearchPrompt-input flex">
                    <textarea v-model="prompt" aria-label="Prompt" @keydown.enter.exact.prevent="submitPrompt" rows="1"
                        @focus="onFocusOrClick" @click="onFocusOrClick" placeholder="Search for what you want" />
                </div>

                <div class="control flex">
                    <TiptoolComp text="Filters">
                        <button class="filter-button" @click="openFilters">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal">
                                <line x1="21" x2="14" y1="4" y2="4" />
                                <line x1="10" x2="3" y1="4" y2="4" />
                                <line x1="21" x2="12" y1="12" y2="12" />
                                <line x1="8" x2="3" y1="12" y2="12" />
                                <line x1="21" x2="16" y1="20" y2="20" />
                                <line x1="12" x2="3" y1="20" y2="20" />
                                <line x1="14" x2="14" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="10" y2="14" />
                                <line x1="16" x2="16" y1="18" y2="22" />
                            </svg>
                        </button>
                    </TiptoolComp>

                    <button class="send-button flex center" type="submit" :disabled="isSubmitting || !prompt.trim()"
                        title="Enviar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-arrow-up-icon lucide-arrow-up">
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                        </svg>
                    </button>

                </div>
            </div>


        </form>
    </div>
</template>

<script setup>

const isFocused = ref(false)

const filterDrawer = ref(false)

function openFilters(e) {
    filterDrawer.value = !filterDrawer.value
}

const prompt = ref('')
const isSubmitting = ref(false)

const route = useRouter()

const router = useRouter()

function submitPrompt() {
    const trimmed = prompt.value.trim()
    if (!trimmed) return

    isSubmitting.value = true

    router.push({
        name: 'country-s',
        query: {
            ...route.query,
            prompt: trimmed,
            vectorized: true
        }
    })

    setTimeout(() => {
        isSubmitting.value = false
    }, 1000)
}
</script>



<style scoped>
.SearchPrompt {
    width: 100%;
    display: flex;
    height: 30rem;
    margin-top: 1rem;
    flex-direction: column;
    box-sizing: border-box;
    background: var(--background-a);
    background-image: url('https://i02.appmifile.com/722_operator_sg/14/05/2025/dfbe8ed8c4fee8aa29dbaa9dc0ffebfc.jpg?thumb=1&w=2560&f=webp&q=85');
    border-radius: var(--radius-d);
}

.controls {
    width: inherit;
    display: flex;
    flex-direction: column;
}

.control {
    justify-content: space-between;
}

.filter-button {
    background: transparent;
    cursor: pointer;
    border: none;
}

.SearchPrompt-form {
    width: inherit;
    display: flex;
    padding: 1rem;
    max-width: 50%;
    margin: auto auto;
    padding-top: 1rem;
    position: relative;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 0.75rem;
    box-shadow: var(--shadow-c);
    border-radius: var(--radius-d);
    background: var(--background-a);
    transition: var(--transition-a);
    border: 1px solid var(--border-a);
}

.SearchPrompt-form.focused {
    border: 1px solid var(--border-b);
}

.SearchPrompt-form:hover {
    border: 1px solid var(--border-b);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.SearchPrompt-input {
    flex: 1;
    display: flex;
    position: relative;
    align-items: center;
}

.SearchPrompt-input textarea {
    z-index: 2;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    height: 4rem;
    line-height: 1.5rem;
    position: relative;
    color: var(--text-a);
    background: transparent;
    font-size: var(--text-size-2);
}

.SearchPrompt-input textarea::placeholder {
    color: var(--text-b);
    font-size: inherit;
    opacity: 0.6;
}


.send-button {
    background: black;
    color: var(--text-w);
    border: none;
    width: 36px;
    height: 36px;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s ease;
}

.send-button:hover {
    background: #333;
}

.send-button:disabled {
    background: black;
    pointer-events: none;
}
</style>